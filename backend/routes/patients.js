const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { PATIENTS } = require('../data/sampleData');

let mockPatients = [...PATIENTS];
const allowMockFallback = process.env.NODE_ENV !== 'production';
const demoUserIds = new Set(['admin-001', 'staff-001', 'coord-001']);

function calcPriorityScore(patient) {
  let score = 0;
  if (patient.medical_priority === 'Critical') score += 40;
  else if (patient.medical_priority === 'High') score += 30;
  else if (patient.medical_priority === 'Medium') score += 15;
  else score += 5;
  score += Math.min(30, (patient.waiting_duration || 0) * 0.5);
  const rare = ['O-', 'AB-', 'B-', 'A-'];
  if (rare.includes(patient.blood_group)) score += 15;
  else score += 5;
  if (patient.required_organ === 'Heart' || patient.required_organ === 'Lung') score += 15;
  else if (patient.required_organ === 'Liver') score += 10;
  else score += 5;
  return Math.round(Math.min(100, score));
}

function getMockPatients(queryParams = {}, user = {}) {
  const { required_organ, blood_group, status, search, sort_by = 'priority', page = 1 } = queryParams;
  const visiblePatients = demoUserIds.has(user.id)
    ? mockPatients
    : mockPatients.filter(p => p.user_id === user.id);
  let data = visiblePatients.map(p => ({ ...p, priority_score: calcPriorityScore(p) }));
  if (required_organ) data = data.filter(p => p.required_organ === required_organ);
  if (blood_group) data = data.filter(p => p.blood_group === blood_group);
  if (status) data = data.filter(p => p.status === status);
  if (search) data = data.filter(p => p.patient_name.toLowerCase().includes(search.toLowerCase()));
  if (sort_by === 'priority') data.sort((a, b) => b.priority_score - a.priority_score);
  else if (sort_by === 'waiting') data.sort((a, b) => b.waiting_duration - a.waiting_duration);
  else if (sort_by === 'name') data.sort((a, b) => a.patient_name.localeCompare(b.patient_name));
  return { data, total: data.length, page: parseInt(page) };
}

function updateMockPatient(id, updates) {
  const idx = mockPatients.findIndex(p => p.id === id);
  if (idx === -1) return null;
  mockPatients[idx] = { ...mockPatients[idx], ...updates };
  mockPatients[idx].priority_score = calcPriorityScore(mockPatients[idx]);
  const sampleIdx = PATIENTS.findIndex(p => p.id === id);
  if (sampleIdx !== -1) PATIENTS[sampleIdx] = { ...PATIENTS[sampleIdx], ...updates };
  return mockPatients[idx];
}

function addMockPatient(patient) {
  mockPatients.push(patient);
  if (!PATIENTS.some(p => p.id === patient.id)) PATIENTS.push(patient);
}

function deleteMockPatient(id) {
  mockPatients = mockPatients.filter(p => p.id !== id);
  const sampleIdx = PATIENTS.findIndex(p => p.id === id);
  if (sampleIdx !== -1) PATIENTS.splice(sampleIdx, 1);
}

// GET /api/patients
router.get('/', verifyToken, async (req, res) => {
  try {
    const { required_organ, blood_group, status, search, sort_by = 'priority', page = 1, limit = 50 } = req.query;

    if (supabase) {
      let query = supabase.from('patients').select('*');
      if (required_organ) query = query.eq('required_organ', required_organ);
      if (blood_group) query = query.eq('blood_group', blood_group);
      if (status) query = query.eq('status', status);
      if (search) query = query.ilike('patient_name', `%${search}%`);
      query = query.order('created_at', { ascending: false }).range((page-1)*limit, page*limit-1);
      const { data, error } = await query;
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase patients fetch failed, using mock data:', error.message);
          return res.json(getMockPatients(req.query, req.user));
        }
        throw error;
      }
      const enriched = data.map(p => ({ ...p, priority_score: calcPriorityScore(p) }));
      return res.json({ data: enriched, total: enriched.length, page: parseInt(page) });
    }

    res.json(getMockPatients(req.query, req.user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients
router.post('/', verifyToken, async (req, res) => {
  try {
    const patient = { id: uuidv4(), ...req.body, user_id: req.user.id, created_at: new Date().toISOString() };
    patient.priority_score = calcPriorityScore(patient);

    if (supabase) {
      const { data, error } = await supabase.from('patients').insert(patient).select().single();
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase patient insert failed, using mock data:', error.message);
          addMockPatient(patient);
          return res.status(201).json(patient);
        }
        throw error;
      }
      return res.status(201).json({ ...data, priority_score: calcPriorityScore(data) });
    }

    addMockPatient(patient);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/patients/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    if (supabase) {
      const { data, error } = await supabase.from('patients').update(updates).eq('id', id).select().single();
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase patient update failed, using mock data:', error.message);
          const updated = updateMockPatient(id, updates);
          if (!updated) return res.status(404).json({ error: 'Patient not found' });
          return res.json(updated);
        }
        throw error;
      }
      return res.json({ ...data, priority_score: calcPriorityScore(data) });
    }

    const updated = updateMockPatient(id, updates);
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/patients/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      const { error } = await supabase.from('patients').delete().eq('id', id);
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase patient delete failed, using mock data:', error.message);
          deleteMockPatient(id);
          return res.json({ message: 'Patient deleted' });
        }
        throw error;
      }
      return res.json({ message: 'Patient deleted' });
    }
    deleteMockPatient(id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
