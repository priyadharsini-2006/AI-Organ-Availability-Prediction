-- ============================================================
-- AI Organ Availability Prediction — Supabase Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor to create all tables
-- ============================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  role        TEXT NOT NULL DEFAULT 'Hospital Staff' CHECK (role IN ('Admin','Hospital Staff','Organ Coordinator')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS hospitals (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  location           TEXT,
  contact            TEXT,
  organ_types        TEXT[] DEFAULT '{}',
  current_demand     TEXT DEFAULT 'Medium',
  number_of_patients INTEGER DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ORGAN_RECORDS TABLE
CREATE TABLE IF NOT EXISTS organ_records (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organ_type           TEXT NOT NULL,
  blood_group          TEXT NOT NULL,
  donor_age            TEXT,
  donor_gender         TEXT,
  organ_condition      TEXT,
  location             TEXT,
  availability_status  TEXT DEFAULT 'Available',
  donation_date        DATE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name      TEXT NOT NULL,
  age               INTEGER,
  blood_group       TEXT,
  required_organ    TEXT,
  medical_priority  TEXT DEFAULT 'High',
  waiting_duration  INTEGER DEFAULT 0,
  hospital          TEXT,
  location          TEXT,
  status            TEXT DEFAULT 'Active',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS predictions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organ_type         TEXT NOT NULL,
  blood_group        TEXT,
  prediction_score   INTEGER,
  availability_level TEXT,
  confidence_score   INTEGER,
  estimated_time     TEXT,
  prediction_factors JSONB DEFAULT '{}',
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  user_id            UUID REFERENCES auth.users(id)
);

-- HOSPITAL_DEMAND TABLE
CREATE TABLE IF NOT EXISTS hospital_demand (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id      UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  organ_type       TEXT,
  demand_level     TEXT,
  number_of_patients INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals   ENABLE ROW LEVEL SECURITY;
ALTER TABLE organ_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients    ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_demand ENABLE ROW LEVEL SECURITY;

-- Users: authenticated users can read all, update own
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own record" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Hospitals: authenticated read/write
CREATE POLICY "Authenticated users manage hospitals" ON hospitals FOR ALL USING (auth.role() = 'authenticated');

-- Organ records: authenticated read/write
CREATE POLICY "Authenticated users manage organs" ON organ_records FOR ALL USING (auth.role() = 'authenticated');

-- Patients: authenticated read/write
CREATE POLICY "Authenticated users manage patients" ON patients FOR ALL USING (auth.role() = 'authenticated');

-- Predictions: users see their own, admins see all
CREATE POLICY "Users see own predictions" ON predictions FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
);
CREATE POLICY "Users create predictions" ON predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own predictions" ON predictions FOR DELETE USING (auth.uid() = user_id);

-- Hospital demand: authenticated
CREATE POLICY "Authenticated users manage demand" ON hospital_demand FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SAMPLE DATA
-- ============================================================

INSERT INTO hospitals (name, location, contact, organ_types, current_demand, number_of_patients) VALUES
  ('City General Hospital', 'North Urban', '+1-555-0101', ARRAY['Kidney','Liver','Heart'], 'High', 45),
  ('Regional Medical Center', 'South Urban', '+1-555-0102', ARRAY['Kidney','Cornea','Lung'], 'Medium', 32),
  ('East Side Healthcare', 'East Rural', '+1-555-0103', ARRAY['Kidney','Liver'], 'High', 28),
  ('Northern Transplant Institute', 'North Central', '+1-555-0104', ARRAY['Heart','Lung','Liver'], 'Very High', 61),
  ('West Valley Medical', 'West Urban', '+1-555-0105', ARRAY['Kidney','Pancreas','Cornea'], 'Medium', 22),
  ('Central University Hospital', 'Central Urban', '+1-555-0106', ARRAY['Kidney','Liver','Heart','Lung','Pancreas','Cornea'], 'Very High', 88)
ON CONFLICT DO NOTHING;

INSERT INTO organ_records (organ_type, blood_group, donor_age, donor_gender, organ_condition, location, availability_status, donation_date) VALUES
  ('Kidney', 'O+', '36-50', 'Male', 'Good', 'North Urban', 'Available', '2024-11-01'),
  ('Liver', 'A+', '18-35', 'Female', 'Excellent', 'South Urban', 'Available', '2024-11-03'),
  ('Heart', 'B+', '18-35', 'Male', 'Excellent', 'Central Urban', 'Matched', '2024-11-05'),
  ('Kidney', 'AB+', '36-50', 'Female', 'Good', 'West Urban', 'Available', '2024-11-07'),
  ('Cornea', 'O-', '51-65', 'Male', 'Good', 'East Rural', 'Available', '2024-11-08'),
  ('Lung', 'A-', '18-35', 'Female', 'Good', 'North Central', 'Transplanted', '2024-10-20'),
  ('Pancreas', 'B-', '36-50', 'Male', 'Fair', 'South Urban', 'Available', '2024-11-10'),
  ('Kidney', 'O+', '51-65', 'Female', 'Good', 'Central Urban', 'Available', '2024-11-11'),
  ('Liver', 'AB-', '18-35', 'Male', 'Excellent', 'West Urban', 'Available', '2024-11-12'),
  ('Kidney', 'B+', '36-50', 'Male', 'Excellent', 'North Urban', 'Available', '2024-11-14'),
  ('Heart', 'O+', '18-35', 'Female', 'Excellent', 'Central Urban', 'Available', '2024-11-15'),
  ('Cornea', 'A+', '65+', 'Male', 'Good', 'East Rural', 'Available', '2024-11-16'),
  ('Kidney', 'A+', '36-50', 'Female', 'Good', 'South Urban', 'Matched', '2024-11-17'),
  ('Lung', 'O-', '18-35', 'Male', 'Good', 'North Central', 'Available', '2024-11-18'),
  ('Liver', 'B+', '51-65', 'Female', 'Fair', 'West Urban', 'Available', '2024-11-19')
ON CONFLICT DO NOTHING;

INSERT INTO patients (patient_name, age, blood_group, required_organ, medical_priority, waiting_duration, hospital, location, status) VALUES
  ('James Wilson', 45, 'O+', 'Kidney', 'Critical', 18, 'City General Hospital', 'North Urban', 'Active'),
  ('Emily Rodriguez', 38, 'A+', 'Liver', 'High', 12, 'Regional Medical Center', 'South Urban', 'Active'),
  ('Robert Kim', 52, 'B+', 'Heart', 'Critical', 8, 'Northern Transplant Institute', 'North Central', 'Active'),
  ('Sarah Thompson', 29, 'O-', 'Kidney', 'High', 24, 'Central University Hospital', 'Central Urban', 'Active'),
  ('Michael Davis', 61, 'AB+', 'Kidney', 'Medium', 6, 'West Valley Medical', 'West Urban', 'Active'),
  ('Jennifer Martinez', 44, 'A-', 'Lung', 'Critical', 15, 'Northern Transplant Institute', 'North Central', 'Active'),
  ('David Brown', 55, 'O+', 'Liver', 'High', 20, 'City General Hospital', 'North Urban', 'Active'),
  ('Lisa Anderson', 33, 'B-', 'Pancreas', 'High', 10, 'East Side Healthcare', 'East Rural', 'Active'),
  ('Thomas Jackson', 67, 'A+', 'Cornea', 'Medium', 36, 'Regional Medical Center', 'South Urban', 'Active'),
  ('Patricia White', 41, 'O+', 'Kidney', 'Critical', 30, 'Central University Hospital', 'Central Urban', 'Active'),
  ('Christopher Harris', 48, 'AB-', 'Heart', 'Critical', 5, 'Northern Transplant Institute', 'North Central', 'Active'),
  ('Amanda Lewis', 36, 'B+', 'Kidney', 'High', 14, 'West Valley Medical', 'West Urban', 'Matched'),
  ('Kevin Clark', 59, 'O-', 'Liver', 'High', 22, 'City General Hospital', 'North Urban', 'Active'),
  ('Rachel Turner', 27, 'A+', 'Kidney', 'Medium', 4, 'East Side Healthcare', 'East Rural', 'Active'),
  ('Daniel Scott', 72, 'O+', 'Cornea', 'Low', 48, 'Regional Medical Center', 'South Urban', 'Transplant Completed')
ON CONFLICT DO NOTHING;
