const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { calculatePrediction } = require('../services/predictionEngine');
const { PREDICTIONS } = require('../data/sampleData');

let mockPredictions = [...PREDICTIONS];
const allowMockFallback = process.env.NODE_ENV !== 'production';
const demoUserIds = new Set(['admin-001', 'staff-001', 'coord-001']);

function getMockPredictions(queryParams = {}, user = {}) {
  const { organ_type, blood_group, availability_level, page = 1 } = queryParams;
  let data = demoUserIds.has(user.id)
    ? [...mockPredictions]
    : mockPredictions.filter(p => p.user_id === user.id);
  if (organ_type) data = data.filter(p => p.organ_type === organ_type);
  if (blood_group) data = data.filter(p => p.blood_group === blood_group);
  if (availability_level) data = data.filter(p => p.availability_level === availability_level);
  return { data, total: data.length, page: parseInt(page) };
}

function addMockPrediction(prediction) {
  mockPredictions.unshift(prediction);
  if (!PREDICTIONS.some(p => p.id === prediction.id)) PREDICTIONS.unshift(prediction);
}

function deleteMockPrediction(id) {
  mockPredictions = mockPredictions.filter(p => p.id !== id);
  const sampleIdx = PREDICTIONS.findIndex(p => p.id === id);
  if (sampleIdx !== -1) PREDICTIONS.splice(sampleIdx, 1);
}

// POST /api/predictions — generate a prediction
router.post('/', verifyToken, async (req, res) => {
  try {
    const result = calculatePrediction(req.body);
    const predictionRecord = {
      id: uuidv4(),
      organ_type: result.organType,
      blood_group: result.bloodGroup,
      prediction_score: result.predictionScore,
      availability_level: result.availabilityLevel,
      confidence_score: result.confidenceScore,
      estimated_time: result.estimatedAvailabilityTime,
      prediction_factors: {
        positiveFactors: result.positiveFactors,
        negativeFactors: result.negativeFactors,
        breakdown: result.breakdown
      },
      created_at: result.generatedAt,
      user_id: req.user.id
    };

    if (supabase) {
      const { data, error } = await supabase.from('predictions').insert(predictionRecord).select().single();
      if (error) console.warn('Prediction save warning:', error.message);
    }

    addMockPrediction(predictionRecord);

    res.status(201).json({ ...result, id: predictionRecord.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/predictions
router.get('/', verifyToken, async (req, res) => {
  try {
    const { organ_type, blood_group, availability_level, page = 1, limit = 20 } = req.query;

    if (supabase) {
      let query = supabase.from('predictions').select('*').order('created_at', { ascending: false });
      if (organ_type) query = query.eq('organ_type', organ_type);
      if (blood_group) query = query.eq('blood_group', blood_group);
      if (availability_level) query = query.eq('availability_level', availability_level);
      if (req.user.role !== 'Admin') query = query.eq('user_id', req.user.id);
      query = query.range((page-1)*limit, page*limit-1);
      const { data, error } = await query;
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase predictions fetch failed, using mock data:', error.message);
          return res.json(getMockPredictions(req.query, req.user));
        }
        throw error;
      }
      return res.json({ data, total: data.length, page: parseInt(page) });
    }

    res.json(getMockPredictions(req.query, req.user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/predictions/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data, error } = await supabase.from('predictions').select('*').eq('id', id).single();
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase prediction fetch failed, using mock data:', error.message);
          const prediction = mockPredictions.find(p => p.id === id);
          if (!prediction) return res.status(404).json({ error: 'Prediction not found' });
          return res.json(prediction);
        }
        return res.status(404).json({ error: 'Prediction not found' });
      }
      return res.json(data);
    }

    const prediction = mockPredictions.find(p => p.id === id);
    if (!prediction) return res.status(404).json({ error: 'Prediction not found' });
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/predictions/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('predictions').delete().eq('id', id);
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase prediction delete failed, using mock data:', error.message);
          deleteMockPrediction(id);
          return res.json({ message: 'Prediction deleted' });
        }
        throw error;
      }
      return res.json({ message: 'Prediction deleted' });
    }

    deleteMockPrediction(id);
    res.json({ message: 'Prediction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
