import bcryptjs from 'bcryptjs';
import { getAll, getOne, create, upsert } from './repository.js';
import { memoryStore } from './memoryStore.js';
import { seedInternships } from '../data/seedInternships.js';
import { dbState } from '../config/db.js';

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@careerpilot.ai',
  password: 'Password@123',
};

export async function seedInitialData() {
  try {
    // Seed internships
    for (const internship of seedInternships) {
      await upsert(
        'internships',
        { title: internship.title, company: internship.company, applyLink: internship.applyLink },
        internship,
        internship
      );
    }
    console.log('✅ Internships seeded');

    // Seed demo user only in memory mode
    if (dbState.mode === 'memory') {
      seedDemoUser();
    }
  } catch (err) {
    console.error('❌ Seed data error:', err.message);
  }
}

export function seedDemoUser() {
  const hashedPassword = bcryptjs.hashSync(DEMO_USER.password, 10);
  const user = memoryStore.getOne('users', { email: DEMO_USER.email });
  
  if (!user) {
    const newUser = memoryStore.create('users', {
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      password: hashedPassword,
    });

    memoryStore.create('profiles', {
      userId: newUser._id,
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

    console.log('✅ Demo user seeded: demo@careerpilot.ai / Password@123');
  }
}

export default {
  seedInitialData,
  seedDemoUser,
};
