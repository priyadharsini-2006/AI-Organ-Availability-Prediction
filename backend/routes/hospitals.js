const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { HOSPITALS } = require('../data/sampleData');

let mockHospitals = [...HOSPITALS];
const allowMockFallback = process.env.NODE_ENV !== 'production';
const demoUserIds = new Set(['admin-001', 'staff-001', 'coord-001']);

function getMockHospitals(queryParams = {}, user = {}) {
  const { search, location, page = 1 } = queryParams;
  let data = demoUserIds.has(user.id)
    ? [...mockHospitals]
    : mockHospitals.filter(h => h.user_id === user.id);
  if (search) data = data.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));
  if (location) data = data.filter(h => h.location.toLowerCase().includes(location.toLowerCase()));
  return { data, total: data.length, page: parseInt(page) };
}

function updateMockHospital(id, updates) {
  const idx = mockHospitals.findIndex(h => h.id === id);
  if (idx === -1) return null;
  mockHospitals[idx] = { ...mockHospitals[idx], ...updates };
  const sampleIdx = HOSPITALS.findIndex(h => h.id === id);
  if (sampleIdx !== -1) HOSPITALS[sampleIdx] = { ...HOSPITALS[sampleIdx], ...updates };
  return mockHospitals[idx];
}

function addMockHospital(hospital) {
  mockHospitals.push(hospital);
  if (!HOSPITALS.some(h => h.id === hospital.id)) HOSPITALS.push(hospital);
}

function deleteMockHospital(id) {
  mockHospitals = mockHospitals.filter(h => h.id !== id);
  const sampleIdx = HOSPITALS.findIndex(h => h.id === id);
  if (sampleIdx !== -1) HOSPITALS.splice(sampleIdx, 1);
}

// GET /api/hospitals
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search, location, page = 1, limit = 50 } = req.query;

    if (supabase) {
      let query = supabase.from('hospitals').select('*').order('name');
      if (search) query = query.ilike('name', `%${search}%`);
      if (location) query = query.ilike('location', `%${location}%`);
      query = query.range((page-1)*limit, page*limit-1);
      const { data, error } = await query;
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase hospitals fetch failed, using mock data:', error.message);
          return res.json(getMockHospitals(req.query, req.user));
        }
        throw error;
      }
      return res.json({ data, total: data.length, page: parseInt(page) });
    }

    res.json(getMockHospitals(req.query, req.user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/hospitals
router.post('/', verifyToken, async (req, res) => {
  try {
    const hospital = { id: uuidv4(), ...req.body, user_id: req.user.id, created_at: new Date().toISOString() };
    if (supabase) {
      const { data, error } = await supabase.from('hospitals').insert(hospital).select().single();
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase hospital insert failed, using mock data:', error.message);
          addMockHospital(hospital);
          return res.status(201).json(hospital);
        }
        throw error;
      }
      return res.status(201).json(data);
    }
    addMockHospital(hospital);
    res.status(201).json(hospital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/hospitals/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    if (supabase) {
      const { data, error } = await supabase.from('hospitals').update(updates).eq('id', id).select().single();
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase hospital update failed, using mock data:', error.message);
          const updated = updateMockHospital(id, updates);
          if (!updated) return res.status(404).json({ error: 'Hospital not found' });
          return res.json(updated);
        }
        throw error;
      }
      return res.json(data);
    }
    const updated = updateMockHospital(id, updates);
    if (!updated) return res.status(404).json({ error: 'Hospital not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/hospitals/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      const { error } = await supabase.from('hospitals').delete().eq('id', id);
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase hospital delete failed, using mock data:', error.message);
          deleteMockHospital(id);
          return res.json({ message: 'Hospital deleted' });
        }
        throw error;
      }
      return res.json({ message: 'Hospital deleted' });
    }
    deleteMockHospital(id);
    res.json({ message: 'Hospital deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
