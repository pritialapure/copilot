import { dbState } from "../config/db.js";
import { Application } from "../models/Application.js";
import { Internship } from "../models/Internship.js";
import { Match } from "../models/Match.js";
import { Notification } from "../models/Notification.js";
import { Profile } from "../models/Profile.js";
import { ResumeHistory } from "../models/ResumeHistory.js";
import { ResumeVersion } from "../models/ResumeVersion.js";
import { User } from "../models/User.js";
import * as memoryStore from "./memoryStore.js";

const modelMap = {
  users: User,
  profiles: Profile,
  internships: Internship,
  matches: Match,
  resumeVersions: ResumeVersion,
  resumeHistory: ResumeHistory,
  applications: Application,
  notifications: Notification
};

function asObject(document) {
  // TODO: Convert a mongoose document to a plain object.
  return document || null;
}

// Every function below must work in both modes: the in-memory store while
// dbState.mode !== "mongo", and the mapped mongoose model once connected.

export async function getAll(collection, filter = {}, sort = {}) {
  // TODO: Return the filtered, sorted records.
  return [];
}

export async function getById(collection, id) {
  // TODO: Return the record for this id.
  return null;
}

export async function getOne(collection, filter = {}) {
  // TODO: Return the first record matching the filter.
  return null;
}

export async function create(collection, data) {
  // TODO: Insert the record and return it.
  return null;
}

export async function updateById(collection, id, data) {
  // TODO: Apply the update and return the saved record.
  return null;
}

export async function upsert(collection, filter, createData, updateData = {}) {
  // TODO: Insert createData when the filter matches nothing, otherwise $set updateData
  // TODO: (and $setOnInsert the insert-only keys in mongo mode).
  return null;
}

export async function deleteById(collection, id) {
  // TODO: Delete the record and return how many were removed.
  return 0;
}

export async function deleteWhere(collection, filter = {}) {
  // TODO: Delete every matching record and return how many were removed.
  return 0;
}
