/**
 * AI Organ Availability Prediction Engine
 * Explainable AI using weighted scoring algorithm
 * Works completely without external AI APIs
 */

const ORGAN_BASE_SCORES = {
  Kidney:   { availability: 72, demand: 85, donationRate: 68 },
  Liver:    { availability: 58, demand: 78, donationRate: 55 },
  Heart:    { availability: 35, demand: 90, donationRate: 32 },
  Lung:     { availability: 30, demand: 82, donationRate: 28 },
  Pancreas: { availability: 42, demand: 60, donationRate: 38 },
  Cornea:   { availability: 75, demand: 65, donationRate: 72 }
};

const BLOOD_GROUP_DEMAND = {
  'O+':  { demandMultiplier: 1.4, availability: 0.7 },
  'O-':  { demandMultiplier: 1.6, availability: 0.5 },
  'A+':  { demandMultiplier: 1.2, availability: 0.8 },
  'A-':  { demandMultiplier: 1.1, availability: 0.75 },
  'B+':  { demandMultiplier: 1.1, availability: 0.82 },
  'B-':  { demandMultiplier: 1.0, availability: 0.85 },
  'AB+': { demandMultiplier: 0.9, availability: 0.92 },
  'AB-': { demandMultiplier: 0.85, availability: 0.95 }
};

const SEASONAL_FACTORS = {
  1:  0.95, 2:  0.92, 3:  1.02, 4:  1.05,
  5:  1.08, 6:  1.10, 7:  1.05, 8:  1.03,
  9:  1.00, 10: 0.98, 11: 0.97, 12: 0.93
};

const REGIONAL_AVAILABILITY = {
  'North':    0.82, 'South': 0.75, 'East':    0.78,
  'West':     0.80, 'Central': 0.85, 'Urban':   0.88,
  'Rural':    0.65, 'default': 0.78
};

function normalize(value, min = 0, max = 100) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function getAvailabilityLevel(score) {
  if (score >= 71) return 'High';
  if (score >= 41) return 'Medium';
  return 'Low';
}

function getDemandLevel(waitingList, hospitals) {
  const total = waitingList + hospitals * 5;
  if (total >= 150) return 'Very High';
  if (total >= 80)  return 'High';
  if (total >= 40)  return 'Medium';
  return 'Low';
}

function getEstimatedTime(score) {
  if (score >= 80) return 'Within 2–4 weeks';
  if (score >= 65) return 'Within 1–3 months';
  if (score >= 50) return 'Within 3–6 months';
  if (score >= 35) return 'Within 6–12 months';
  return 'More than 12 months';
}

function calculatePrediction(data) {
  const {
    organType,
    bloodGroup,
    donorAgeGroup,
    donorGender,
    donorHealthStatus,
    donorLocation,
    organCondition,
    historicalDonationCount,
    currentWaitingListDemand,
    hospitalsRequesting,
    previousAvailabilityTrend,
    seasonalFactor
  } = data;

  const organBase = ORGAN_BASE_SCORES[organType] || ORGAN_BASE_SCORES.Kidney;
  const bloodData = BLOOD_GROUP_DEMAND[bloodGroup] || BLOOD_GROUP_DEMAND['O+'];

  // 1. Historical Availability Score (30%)
  const histCount = parseInt(historicalDonationCount) || 10;
  const histScore = Math.min(100, (histCount / 50) * 100);
  const trendMultiplier = previousAvailabilityTrend === 'Increasing' ? 1.15
    : previousAvailabilityTrend === 'Decreasing' ? 0.80 : 1.0;
  const historicalScore = Math.min(100, histScore * trendMultiplier * (organBase.availability / 100));

  // 2. Donation Trend Score (20%)
  let donationTrendScore = organBase.donationRate;
  if (previousAvailabilityTrend === 'Increasing') donationTrendScore = Math.min(100, donationTrendScore * 1.2);
  if (previousAvailabilityTrend === 'Decreasing') donationTrendScore = Math.max(0, donationTrendScore * 0.75);
  if (donorHealthStatus === 'Excellent') donationTrendScore = Math.min(100, donationTrendScore * 1.1);
  if (donorHealthStatus === 'Poor') donationTrendScore = Math.max(0, donationTrendScore * 0.8);

  // 3. Regional Availability Score (15%)
  const locationKey = Object.keys(REGIONAL_AVAILABILITY).find(k =>
    donorLocation && donorLocation.toLowerCase().includes(k.toLowerCase())
  ) || 'default';
  const regionalScore = REGIONAL_AVAILABILITY[locationKey] * 100;

  // 4. Organ Demand Score (15%) — inverse of demand = availability opportunity
  const waitingList = parseInt(currentWaitingListDemand) || 20;
  const hospitals = parseInt(hospitalsRequesting) || 5;
  const rawDemand = (waitingList / 200) * 100;
  const organDemandScore = Math.max(0, 100 - rawDemand * bloodData.demandMultiplier);

  // 5. Blood Group Availability Score (10%)
  const bloodAvailScore = bloodData.availability * 100;

  // 6. Seasonal Trend Score (10%)
  const currentMonth = new Date().getMonth() + 1;
  const seasonal = seasonalFactor === 'High' ? 1.1
    : seasonalFactor === 'Low' ? 0.85 : SEASONAL_FACTORS[currentMonth] || 1.0;
  const seasonalScore = Math.min(100, organBase.availability * seasonal);

  // Organ condition adjustment
  const conditionMultiplier = organCondition === 'Excellent' ? 1.10
    : organCondition === 'Good' ? 1.0
    : organCondition === 'Fair' ? 0.85
    : 0.65;

  // Age group adjustment
  const ageMultiplier = donorAgeGroup === '18-35' ? 1.10
    : donorAgeGroup === '36-50' ? 1.05
    : donorAgeGroup === '51-65' ? 0.92
    : 0.80;

  // Weighted prediction score
  const rawScore =
    (historicalScore   * 0.30) +
    (donationTrendScore * 0.20) +
    (regionalScore      * 0.15) +
    (organDemandScore   * 0.15) +
    (bloodAvailScore    * 0.10) +
    (seasonalScore      * 0.10);

  const adjustedScore = rawScore * conditionMultiplier * ageMultiplier;
  const finalScore = Math.min(100, Math.max(0, Math.round(adjustedScore)));

  // Confidence score based on data richness
  let confidence = 60;
  if (historicalDonationCount && historicalDonationCount > 0) confidence += 10;
  if (currentWaitingListDemand) confidence += 8;
  if (hospitalsRequesting) confidence += 7;
  if (donorLocation) confidence += 5;
  if (previousAvailabilityTrend !== 'Unknown') confidence += 7;
  if (donorHealthStatus) confidence += 3;
  confidence = Math.min(97, confidence);

  // Build explanation factors
  const positiveFactors = [];
  const negativeFactors = [];

  if (histScore > 60) positiveFactors.push('Strong historical donation rate for ' + organType);
  if (previousAvailabilityTrend === 'Increasing') positiveFactors.push('Increasing availability trend observed');
  if (regionalScore > 75) positiveFactors.push('Good regional organ availability');
  if (bloodAvailScore > 80) positiveFactors.push('Favorable blood group availability (' + bloodGroup + ')');
  if (organCondition === 'Excellent' || organCondition === 'Good') positiveFactors.push('Organ in ' + organCondition.toLowerCase() + ' condition');
  if (ageMultiplier >= 1.05) positiveFactors.push('Optimal donor age group for ' + organType + ' donation');
  if (seasonalScore > 70) positiveFactors.push('Seasonal donation patterns are favorable');

  if (histScore < 40) negativeFactors.push('Low historical donation count for ' + organType);
  if (previousAvailabilityTrend === 'Decreasing') negativeFactors.push('Declining availability trend is a concern');
  if (waitingList > 100) negativeFactors.push('Very high waiting-list demand (' + waitingList + ' patients)');
  if (bloodData.demandMultiplier > 1.3) negativeFactors.push('High blood group demand for ' + bloodGroup);
  if (hospitals > 10) negativeFactors.push('High number of hospitals requesting (' + hospitals + ')');
  if (organCondition === 'Poor' || organCondition === 'Critical') negativeFactors.push('Organ condition may affect transplant viability');
  if (organBase.demand > 80) negativeFactors.push('Historically high national demand for ' + organType);

  // Ensure at least one factor each
  if (positiveFactors.length === 0) positiveFactors.push('Baseline donation capacity exists in region');
  if (negativeFactors.length === 0) negativeFactors.push('Standard demand levels observed for ' + organType);

  const availabilityLevel = getAvailabilityLevel(finalScore);
  const demandLevel = getDemandLevel(waitingList, hospitals);
  const estimatedTime = getEstimatedTime(finalScore);

  // Generate AI explanation
  const explanationParts = [];
  explanationParts.push(
    `Historical ${organType.toLowerCase()} availability score is ${histScore > 60 ? 'strong' : 'moderate'}, ` +
    `with ${histCount} recorded donations in the reference period.`
  );
  if (previousAvailabilityTrend === 'Increasing') {
    explanationParts.push(`An increasing donation trend further boosts availability prospects.`);
  } else if (previousAvailabilityTrend === 'Decreasing') {
    explanationParts.push(`A declining trend in recent donations is a cautionary signal.`);
  }
  explanationParts.push(
    `Blood group ${bloodGroup} has ${bloodData.demandMultiplier > 1.2 ? 'high' : 'moderate'} demand nationally.`
  );
  explanationParts.push(
    `With ${waitingList} patients currently on the waiting list and ${hospitals} hospitals requesting this organ, ` +
    `demand is classified as ${demandLevel}.`
  );
  explanationParts.push(
    `Taking all weighted factors into account, the final prediction score is ${finalScore}/100, ` +
    `indicating ${availabilityLevel} availability probability.`
  );

  return {
    organType,
    bloodGroup,
    predictionScore: finalScore,
    availabilityProbability: finalScore,
    availabilityLevel,
    confidenceScore: confidence,
    estimatedAvailabilityTime: estimatedTime,
    demandLevel,
    explanation: explanationParts.join(' '),
    positiveFactors,
    negativeFactors,
    breakdown: {
      historicalScore: Math.round(historicalScore),
      donationTrendScore: Math.round(donationTrendScore),
      regionalScore: Math.round(regionalScore),
      organDemandScore: Math.round(organDemandScore),
      bloodAvailScore: Math.round(bloodAvailScore),
      seasonalScore: Math.round(seasonalScore)
    },
    generatedAt: new Date().toISOString()
  };
}

function generateInsights(organData, patientData, predictionData) {
  const insights = [];

  if (!organData || !patientData) {
    return [
      { type: 'info', title: 'System Ready', message: 'AI Organ Availability Prediction system is operational. Add organ records and patients to generate insights.' }
    ];
  }

  // Count organs by type
  const organCounts = {};
  organData.forEach(o => { organCounts[o.organ_type] = (organCounts[o.organ_type] || 0) + 1; });

  // Most demanded organ from patients
  const demandCounts = {};
  patientData.forEach(p => { demandCounts[p.required_organ] = (demandCounts[p.required_organ] || 0) + 1; });

  const topDemand = Object.entries(demandCounts).sort((a,b) => b[1]-a[1])[0];
  if (topDemand) {
    insights.push({
      type: 'warning',
      title: 'High Organ Demand',
      message: `${topDemand[0]} demand is currently very high with ${topDemand[1]} patients waiting. Procurement efforts should be prioritized.`
    });
  }

  // Blood group analysis
  const bgCounts = {};
  patientData.forEach(p => { bgCounts[p.blood_group] = (bgCounts[p.blood_group] || 0) + 1; });
  const topBG = Object.entries(bgCounts).sort((a,b) => b[1]-a[1])[0];
  if (topBG) {
    insights.push({
      type: 'info',
      title: 'Blood Group Demand',
      message: `Blood group ${topBG[0]} has the highest demand with ${topBG[1]} patients. Donors of this blood group are especially needed.`
    });
  }

  // Waiting list growth
  const active = patientData.filter(p => p.status === 'Active' || p.status === 'active').length;
  if (active > 50) {
    insights.push({
      type: 'critical',
      title: 'Waiting List Alert',
      message: `${active} patients are currently on the active waiting list. Immediate action is needed to increase organ procurement.`
    });
  }

  // Organ availability
  const available = organData.filter(o => o.availability_status === 'Available').length;
  insights.push({
    type: available > 20 ? 'positive' : 'warning',
    title: 'Current Organ Availability',
    message: `${available} organs are currently available. ${available < 20 ? 'Availability is below optimal levels.' : 'Good availability levels maintained.'}`
  });

  // Prediction trend
  if (predictionData && predictionData.length > 0) {
    const avgScore = predictionData.reduce((a,b) => a + (b.prediction_score || 0), 0) / predictionData.length;
    insights.push({
      type: avgScore >= 60 ? 'positive' : 'warning',
      title: 'Prediction Trend',
      message: `Recent AI predictions show an average availability score of ${Math.round(avgScore)}/100, indicating ${avgScore >= 70 ? 'favorable' : avgScore >= 50 ? 'moderate' : 'challenging'} organ availability conditions.`
    });
  }

  // Regional insight
  insights.push({
    type: 'info',
    title: 'Regional Donation Activity',
    message: 'Urban and central regions continue to show higher donation activity. Outreach programs in rural areas could significantly increase organ availability.'
  });

  return insights;
}

module.exports = { calculatePrediction, generateInsights };
