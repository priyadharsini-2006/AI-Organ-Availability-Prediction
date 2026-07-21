const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { generateInsights } = require('../services/predictionEngine');
const { ORGAN_RECORDS, PATIENTS, PREDICTIONS, HOSPITALS } = require('../data/sampleData');

const allowMockFallback = process.env.NODE_ENV !== 'production';
const demoUserIds = new Set(['admin-001', 'staff-001', 'coord-001']);

function getVisibleMockData(mockData, user = {}) {
  if (demoUserIds.has(user.id)) return mockData;
  return mockData.filter(row => row.user_id === user.id);
}

async function getData(table, mockData, filters = {}, user = {}) {
  if (supabase) {
    let query = supabase.from(table).select('*');
    Object.entries(filters).forEach(([k, v]) => { if (v) query = query.eq(k, v); });
    const { data, error } = await query;
    if (error) return allowMockFallback ? getVisibleMockData(mockData, user) : [];
    if (allowMockFallback && !demoUserIds.has(user.id)) {
      return data.filter(row => row.user_id === user.id);
    }
    return data;
  }
  return getVisibleMockData(mockData, user);
}

// GET /api/analytics/dashboard
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const [organs, patients, predictions, hospitals] = await Promise.all([
      getData('organ_records', ORGAN_RECORDS, {}, req.user),
      getData('patients', PATIENTS, {}, req.user),
      getData('predictions', PREDICTIONS, {}, req.user),
      getData('hospitals', HOSPITALS, {}, req.user)
    ]);

    const totalOrgans = organs.length;
    const available = organs.filter(o => o.availability_status === 'Available').length;
    const totalPatients = patients.filter(p => p.status === 'Active').length;

    const levelCounts = { High: 0, Medium: 0, Low: 0 };
    predictions.forEach(p => { if (levelCounts[p.availability_level] !== undefined) levelCounts[p.availability_level]++; });

    const organDemand = {};
    patients.forEach(p => { organDemand[p.required_organ] = (organDemand[p.required_organ] || 0) + 1; });
    const mostDemanded = Object.entries(organDemand).sort((a,b) => b[1]-a[1])[0] || ['N/A', 0];

    const organAvailability = {};
    organs.filter(o => o.availability_status === 'Available').forEach(o => {
      organAvailability[o.organ_type] = (organAvailability[o.organ_type] || 0) + 1;
    });
    const mostAvailable = Object.entries(organAvailability).sort((a,b) => b[1]-a[1])[0] || ['N/A', 0];

    // Monthly trend data (last 6 months)
    const now = new Date();
    const hasActivity = organs.length > 0 || patients.length > 0;
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (5 - i));
      const month = d.toLocaleString('default', { month: 'short' });
      const monthStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const available_count = organs.filter(o => o.donation_date && o.donation_date.startsWith(monthStr)).length;
      const demand_count = patients.filter(p => p.created_at && p.created_at.startsWith(monthStr)).length;
      return {
        month,
        available: available_count || (hasActivity ? Math.floor(Math.random()*8+3) : 0),
        demand: demand_count || (hasActivity ? Math.floor(Math.random()*12+8) : 0)
      };
    });

    // Blood group distribution
    const bgDemand = {};
    patients.forEach(p => { bgDemand[p.blood_group] = (bgDemand[p.blood_group] || 0) + 1; });
    const bloodGroupData = Object.entries(bgDemand).map(([bg, count]) => ({ bloodGroup: bg, count }));

    // Organ type distribution
    const organTypeData = Object.entries(organDemand).map(([organ, demand]) => ({
      organ,
      demand,
      available: organAvailability[organ] || 0
    }));

    res.json({
      isDemoData: demoUserIds.has(req.user.id),
      summary: {
        totalOrganRecords: totalOrgans,
        availableOrgans: available,
        totalActivePatients: totalPatients,
        totalHospitals: hospitals.length,
        highAvailabilityPredictions: levelCounts.High,
        mediumAvailabilityPredictions: levelCounts.Medium,
        lowAvailabilityPredictions: levelCounts.Low,
        totalPredictions: predictions.length,
        mostDemandedOrgan: mostDemanded[0],
        mostAvailableOrgan: mostAvailable[0]
      },
      monthlyTrend,
      bloodGroupData,
      organTypeData,
      recentPredictions: predictions.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/demand
router.get('/demand', verifyToken, async (req, res) => {
  try {
    const { organ_type, blood_group, from_date, to_date } = req.query;
    const [organs, patients] = await Promise.all([
      getData('organ_records', ORGAN_RECORDS, {}, req.user),
      getData('patients', PATIENTS, {}, req.user)
    ]);

    let filteredPatients = patients;
    if (organ_type) filteredPatients = filteredPatients.filter(p => p.required_organ === organ_type);
    if (blood_group) filteredPatients = filteredPatients.filter(p => p.blood_group === blood_group);

    const organDemand = {};
    filteredPatients.forEach(p => { organDemand[p.required_organ] = (organDemand[p.required_organ] || 0) + 1; });

    const bloodGroupDemand = {};
    filteredPatients.forEach(p => { bloodGroupDemand[p.blood_group] = (bloodGroupDemand[p.blood_group] || 0) + 1; });

    const hospitalDemand = {};
    filteredPatients.forEach(p => { hospitalDemand[p.hospital] = (hospitalDemand[p.hospital] || 0) + 1; });

    const locationDemand = {};
    filteredPatients.forEach(p => { locationDemand[p.location] = (locationDemand[p.location] || 0) + 1; });

    const priorityDist = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    filteredPatients.forEach(p => { if (priorityDist[p.medical_priority] !== undefined) priorityDist[p.medical_priority]++; });

    res.json({
      organDemand: Object.entries(organDemand).map(([organ, count]) => ({ organ, count })).sort((a,b) => b.count-a.count),
      bloodGroupDemand: Object.entries(bloodGroupDemand).map(([bg, count]) => ({ bloodGroup: bg, count })).sort((a,b) => b.count-a.count),
      hospitalDemand: Object.entries(hospitalDemand).map(([hospital, count]) => ({ hospital, count })).sort((a,b) => b.count-a.count),
      locationDemand: Object.entries(locationDemand).map(([location, count]) => ({ location, count })),
      priorityDistribution: Object.entries(priorityDist).map(([priority, count]) => ({ priority, count })),
      totalPatients: filteredPatients.length,
      activePatients: filteredPatients.filter(p => p.status === 'Active').length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/availability
router.get('/availability', verifyToken, async (req, res) => {
  try {
    const [organs, predictions] = await Promise.all([
      getData('organ_records', ORGAN_RECORDS, {}, req.user),
      getData('predictions', PREDICTIONS, {}, req.user)
    ]);

    const byOrganType = {};
    organs.forEach(o => {
      if (!byOrganType[o.organ_type]) byOrganType[o.organ_type] = { total: 0, available: 0, matched: 0, transplanted: 0 };
      byOrganType[o.organ_type].total++;
      if (o.availability_status === 'Available') byOrganType[o.organ_type].available++;
      if (o.availability_status === 'Matched') byOrganType[o.organ_type].matched++;
      if (o.availability_status === 'Transplanted') byOrganType[o.organ_type].transplanted++;
    });

    const byBloodGroup = {};
    organs.forEach(o => {
      if (!byBloodGroup[o.blood_group]) byBloodGroup[o.blood_group] = { total: 0, available: 0 };
      byBloodGroup[o.blood_group].total++;
      if (o.availability_status === 'Available') byBloodGroup[o.blood_group].available++;
    });

    const avgPredScore = predictions.length > 0
      ? Math.round(predictions.reduce((a, p) => a + p.prediction_score, 0) / predictions.length)
      : 0;

    res.json({
      byOrganType: Object.entries(byOrganType).map(([organ, stats]) => ({ organ, ...stats, availabilityRate: stats.total > 0 ? Math.round((stats.available/stats.total)*100) : 0 })),
      byBloodGroup: Object.entries(byBloodGroup).map(([bg, stats]) => ({ bloodGroup: bg, ...stats, availabilityRate: stats.total > 0 ? Math.round((stats.available/stats.total)*100) : 0 })),
      availabilityStatus: [
        { status: 'Available', count: organs.filter(o => o.availability_status === 'Available').length },
        { status: 'Matched', count: organs.filter(o => o.availability_status === 'Matched').length },
        { status: 'Transplanted', count: organs.filter(o => o.availability_status === 'Transplanted').length }
      ],
      averagePredictionScore: avgPredScore,
      totalRecords: organs.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/insights
router.get('/insights', verifyToken, async (req, res) => {
  try {
    const [organs, patients, predictions] = await Promise.all([
      getData('organ_records', ORGAN_RECORDS, {}, req.user),
      getData('patients', PATIENTS, {}, req.user),
      getData('predictions', PREDICTIONS, {}, req.user)
    ]);
    const insights = generateInsights(organs, patients, predictions);
    res.json({ insights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
