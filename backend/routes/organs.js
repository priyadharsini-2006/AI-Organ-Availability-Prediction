const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { ORGAN_RECORDS } = require('../data/sampleData');

let mockOrgans = [...ORGAN_RECORDS];
const allowMockFallback = process.env.NODE_ENV !== 'production';
const demoUserIds = new Set(['admin-001', 'staff-001', 'coord-001']);

function getMockOrgans(queryParams = {}, user = {}) {
  const { organ_type, blood_group, status, location, page = 1 } = queryParams;
  let data = demoUserIds.has(user.id)
    ? [...mockOrgans]
    : mockOrgans.filter(o => o.user_id === user.id);
  if (organ_type) data = data.filter(o => o.organ_type === organ_type);
  if (blood_group) data = data.filter(o => o.blood_group === blood_group);
  if (status) data = data.filter(o => o.availability_status === status);
  if (location) data = data.filter(o => o.location.toLowerCase().includes(location.toLowerCase()));
  return { data, total: data.length, page: parseInt(page) };
}

function updateMockOrgan(id, updates) {
  const idx = mockOrgans.findIndex(o => o.id === id);
  if (idx === -1) return null;
  mockOrgans[idx] = { ...mockOrgans[idx], ...updates };
  const sampleIdx = ORGAN_RECORDS.findIndex(o => o.id === id);
  if (sampleIdx !== -1) ORGAN_RECORDS[sampleIdx] = { ...ORGAN_RECORDS[sampleIdx], ...updates };
  return mockOrgans[idx];
}

function addMockOrgan(organ) {
  mockOrgans.push(organ);
  if (!ORGAN_RECORDS.some(o => o.id === organ.id)) ORGAN_RECORDS.push(organ);
}

function deleteMockOrgan(id) {
  mockOrgans = mockOrgans.filter(o => o.id !== id);
  const sampleIdx = ORGAN_RECORDS.findIndex(o => o.id === id);
  if (sampleIdx !== -1) ORGAN_RECORDS.splice(sampleIdx, 1);
}

// GET /api/organs
router.get('/', verifyToken, async (req, res) => {
  try {
    const { organ_type, blood_group, status, location, page = 1, limit = 50 } = req.query;

    if (supabase) {
      let query = supabase.from('organ_records').select('*').order('created_at', { ascending: false });
      if (organ_type) query = query.eq('organ_type', organ_type);
      if (blood_group) query = query.eq('blood_group', blood_group);
      if (status) query = query.eq('availability_status', status);
      if (location) query = query.ilike('location', `%${location}%`);
      query = query.range((page-1)*limit, page*limit-1);
      const { data, error } = await query;
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase organ fetch failed, using mock data:', error.message);
          return res.json(getMockOrgans(req.query, req.user));
        }
        throw error;
      }
      return res.json({ data, total: data.length, page: parseInt(page) });
    }

    res.json(getMockOrgans(req.query, req.user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/organs
router.post('/', verifyToken, async (req, res) => {
  try {
    const organ = {
      id: uuidv4(),
      ...req.body,
      user_id: req.user.id,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('organ_records').insert(organ).select().single();
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase organ insert failed, using mock data:', error.message);
          addMockOrgan(organ);
          return res.status(201).json(organ);
        }
        throw error;
      }
      return res.status(201).json(data);
    }

    addMockOrgan(organ);
    res.status(201).json(organ);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/organs/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    if (supabase) {
      const { data, error } = await supabase.from('organ_records').update(updates).eq('id', id).select().single();
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase organ update failed, using mock data:', error.message);
          const updated = updateMockOrgan(id, updates);
          if (!updated) return res.status(404).json({ error: 'Organ record not found' });
          return res.json(updated);
        }
        throw error;
      }
      return res.json(data);
    }

    const updated = updateMockOrgan(id, updates);
    if (!updated) return res.status(404).json({ error: 'Organ record not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/organs/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('organ_records').delete().eq('id', id);
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase organ delete failed, using mock data:', error.message);
          deleteMockOrgan(id);
          return res.json({ message: 'Organ record deleted' });
        }
        throw error;
      }
      return res.json({ message: 'Organ record deleted' });
    }

    deleteMockOrgan(id);
    res.json({ message: 'Organ record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
