import { dbState } from '../config/db.js';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Internship } from '../models/Internship.js';
import { Match } from '../models/Match.js';
import { ResumeVersion } from '../models/ResumeVersion.js';
import { ResumeHistory } from '../models/ResumeHistory.js';
import { Application } from '../models/Application.js';
import { Notification } from '../models/Notification.js';
import { memoryStore } from './memoryStore.js';

const collections = {
  users: 'User',
  profiles: 'Profile',
  internships: 'Internship',
  matches: 'Match',
  resumeVersions: 'ResumeVersion',
  resumeHistory: 'ResumeHistory',
  applications: 'Application',
  notifications: 'Notification',
};

const modelMap = {
  users: User,
  profiles: Profile,
  internships: Internship,
  matches: Match,
  resumeVersions: ResumeVersion,
  resumeHistory: ResumeHistory,
  applications: Application,
  notifications: Notification,
};

export async function getAll(collection, filter = {}, sort = {}) {
  if (dbState.mode === 'memory') {
    return memoryStore.getAll(collection, filter, sort);
  }
  const Model = modelMap[collection];
  return Model.find(filter).sort(sort).lean();
}

export async function getById(collection, id) {
  if (dbState.mode === 'memory') {
    return memoryStore.getById(collection, id);
  }
  const Model = modelMap[collection];
  return Model.findById(id).lean();
}

export async function getOne(collection, filter) {
  if (dbState.mode === 'memory') {
    return memoryStore.getOne(collection, filter);
  }
  const Model = modelMap[collection];
  return Model.findOne(filter).lean();
}

export async function create(collection, data) {
  if (dbState.mode === 'memory') {
    return memoryStore.create(collection, data);
  }
  const Model = modelMap[collection];
  const doc = new Model(data);
  await doc.save();
  return doc.toObject();
}

export async function updateById(collection, id, data) {
  if (dbState.mode === 'memory') {
    return memoryStore.updateById(collection, id, data);
  }
  const Model = modelMap[collection];
  const updated = await Model.findByIdAndUpdate(id, data, { new: true }).lean();
  return updated;
}

export async function upsert(collection, filter, createData, updateData = {}) {
  if (dbState.mode === 'memory') {
    return memoryStore.upsert(collection, filter, createData, updateData);
  }
  const Model = modelMap[collection];
  const updated = await Model.findOneAndUpdate(
    filter,
    { $set: updateData, $setOnInsert: createData },
    { upsert: true, new: true }
  ).lean();
  return updated;
}

export async function deleteById(collection, id) {
  if (dbState.mode === 'memory') {
    return memoryStore.deleteById(collection, id);
  }
  const Model = modelMap[collection];
  await Model.findByIdAndDelete(id);
}

export async function deleteWhere(collection, filter) {
  if (dbState.mode === 'memory') {
    return memoryStore.deleteWhere(collection, filter);
  }
  const Model = modelMap[collection];
  await Model.deleteMany(filter);
}

export default {
  getAll,
  getById,
  getOne,
  create,
  updateById,
  upsert,
  deleteById,
  deleteWhere,
};
