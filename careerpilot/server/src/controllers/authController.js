import bcryptjs from 'bcryptjs';
import { getOne, create } from '../services/repository.js';
import { signToken } from '../utils/jwt.js';
import { httpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw httpError(400, 'Name, email, and password are required');
  }

  const existingUser = await getOne('users', { email: email.toLowerCase() });
  if (existingUser) {
    throw httpError(409, 'Email already exists');
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const user = await create('users', {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  // Create empty profile
  const profile = await create('profiles', {
    userId: user._id,
    skills: [],
    projects: [],
    experience: [],
    education: [],
    preferences: {
      roles: [],
      location: '',
      workMode: '',
      stipendRange: '',
    },
    resumeText: '',
    embedding: [],
  });

  const token = signToken({ userId: user._id });

  res.status(201).json({
    user: { _id: user._id, name: user.name, email: user.email },
    profile,
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw httpError(400, 'Email and password are required');
  }

  const user = await getOne('users', { email: email.toLowerCase() });
  if (!user) {
    throw httpError(401, 'Invalid email or password');
  }

  const isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) {
    throw httpError(401, 'Invalid email or password');
  }

  const token = signToken({ userId: user._id });

  res.json({
    user: { _id: user._id, name: user.name, email: user.email },
    token,
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getOne('users', { _id: req.userId });
  if (!user) {
    throw httpError(404, 'User not found');
  }

  res.json({
    user: { _id: user._id, name: user.name, email: user.email },
  });
});

export default { register, login, getCurrentUser };
