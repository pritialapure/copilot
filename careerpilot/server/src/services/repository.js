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
  // MongoDB rejects an update where the same field path appears in both $set
  // and $setOnInsert (error: "Updating the path 'x' would create a conflict at
  // 'x'"). Callers throughout this app pass the same/overlapping object for
  // both createData and updateData (e.g. "upsert this internship with these
  // final values, whether it's new or already exists"), so we always strip any
  // key from $setOnInsert that's already present in $set to avoid the conflict.
  // Anything left in $setOnInsert only ever applies on the initial insert.
  const setOnInsert = Object.fromEntries(
    Object.entries(createData || {}).filter(([key]) => !(key in (updateData || {})))
  );

  const updateDoc = { $set: updateData };
  if (Object.keys(setOnInsert).length > 0) {
    updateDoc.$setOnInsert = setOnInsert;
  }

  const updated = await Model.findOneAndUpdate(filter, updateDoc, {
    upsert: true,
    new: true,
  }).lean();
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