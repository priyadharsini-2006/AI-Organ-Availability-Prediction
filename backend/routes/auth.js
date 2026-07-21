const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { JWT_SECRET } = require('../middleware/auth');

// In-memory user store for demo when Supabase not configured
const mockUsers = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@organpredict.com',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'Admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'staff-001',
    name: 'Dr. Sarah Johnson',
    email: 'staff@organpredict.com',
    password: bcrypt.hashSync('Staff@123', 10),
    role: 'Hospital Staff',
    created_at: new Date().toISOString()
  },
  {
    id: 'coord-001',
    name: 'Dr. Michael Chen',
    email: 'coordinator@organpredict.com',
    password: bcrypt.hashSync('Coord@123', 10),
    role: 'Organ Coordinator',
    created_at: new Date().toISOString()
  }
];

const allowMockFallback = process.env.NODE_ENV !== 'production';

async function registerMockUser({ name, email, password, role }) {
  const existing = mockUsers.find(u => u.email === email);
  if (existing) return { status: 400, body: { error: 'Email already registered' } };

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role,
    created_at: new Date().toISOString()
  };
  mockUsers.push(newUser);

  const token = jwt.sign({ id: newUser.id, email, name, role }, JWT_SECRET, { expiresIn: '7d' });
  return {
    status: 201,
    body: {
      message: 'Registration successful',
      token,
      user: { id: newUser.id, name, email, role }
    }
  };
}

async function loginMockUser({ email, password }) {
  const user = mockUsers.find(u => u.email === email);
  if (!user) return { status: 401, body: { error: 'Invalid credentials' } };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { status: 401, body: { error: 'Invalid credentials' } };

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  return {
    status: 200,
    body: {
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }
  };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'Hospital Staff' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const validRoles = ['Admin', 'Hospital Staff', 'Organ Coordinator'];
    const userRole = validRoles.includes(role) ? role : 'Hospital Staff';

    if (supabase) {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: userRole } }
      });

      if (authError) {
        if (allowMockFallback) {
          console.warn('Supabase registration failed, using mock auth fallback:', authError.message);
          const fallback = await registerMockUser({ name, email, password, role: userRole });
          return res.status(fallback.status).json(fallback.body);
        }
        return res.status(400).json({ error: authError.message });
      }

      // Insert into users table
      const { error: dbError } = await supabase.from('users').insert({
        id: authData.user.id,
        name,
        email,
        role: userRole
      });

      if (dbError) console.warn('DB insert warning:', dbError.message);

      const token = jwt.sign(
        { id: authData.user.id, email, name, role: userRole },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: { id: authData.user.id, name, email, role: userRole }
      });
    }

    // Mock mode
    const fallback = await registerMockUser({ name, email, password, role: userRole });
    res.status(fallback.status).json(fallback.body);

  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (allowMockFallback) {
          console.warn('Supabase login failed, using mock auth fallback:', error.message);
          const fallback = await loginMockUser({ email, password });
          return res.status(fallback.status).json(fallback.body);
        }
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { data: userData } = await supabase.from('users').select('*').eq('id', data.user.id).single();
      const role = userData?.role || data.user.user_metadata?.role || 'Hospital Staff';
      const name = userData?.name || data.user.user_metadata?.name || email;

      const token = jwt.sign({ id: data.user.id, email, name, role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ message: 'Login successful', token, user: { id: data.user.id, name, email, role } });
    }

    // Mock mode
    const fallback = await loginMockUser({ email, password });
    res.status(fallback.status).json(fallback.body);

  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').verifyToken, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
