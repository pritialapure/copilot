import { v4 as uuidv4 } from 'uuid';

function withId(data) {
  return {
    _id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

class MemoryStore {
  constructor() {
    this.users = [];
    this.profiles = [];
    this.internships = [];
    this.matches = [];
    this.resumeVersions = [];
    this.resumeHistory = [];
    this.applications = [];
    this.notifications = [];
  }

  getCollection(name) {
    return this[name] || [];
  }

  getAll(collection, filter = {}, sort = {}) {
    let items = clone(this.getCollection(collection));
    
    // Apply filter
    items = items.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    });

    // Apply sort
    if (Object.keys(sort).length > 0) {
      items.sort((a, b) => {
        for (const [key, order] of Object.entries(sort)) {
          if (a[key] < b[key]) return order === 1 ? -1 : 1;
          if (a[key] > b[key]) return order === 1 ? 1 : -1;
        }
        return 0;
      });
    }

    return items;
  }

  getById(collection, id) {
    const items = this.getCollection(collection);
    return clone(items.find(item => item._id === id)) || null;
  }

  getOne(collection, filter) {
    const items = this.getCollection(collection);
    const item = items.find(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
    return item ? clone(item) : null;
  }

  create(collection, data) {
    const items = this.getCollection(collection);
    const newItem = withId(data);
    items.push(newItem);
    return clone(newItem);
  }

  updateById(collection, id, data) {
    const items = this.getCollection(collection);
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, updatedAt: new Date() };
    return clone(items[index]);
  }

  upsert(collection, filter, createData, updateData = {}) {
    const items = this.getCollection(collection);
    const index = items.findIndex(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    });

    if (index === -1) {
      const newItem = withId({ ...createData, ...updateData });
      items.push(newItem);
      return clone(newItem);
    }

    items[index] = { ...items[index], ...updateData, updatedAt: new Date() };
    return clone(items[index]);
  }

  deleteById(collection, id) {
    const items = this.getCollection(collection);
    const index = items.findIndex(item => item._id === id);
    if (index !== -1) items.splice(index, 1);
  }

  deleteWhere(collection, filter) {
    const items = this.getCollection(collection);
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      let matches = true;
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) {
          matches = false;
          break;
        }
      }
      if (matches) items.splice(i, 1);
    }
  }

  clear() {
    this.users = [];
    this.profiles = [];
    this.internships = [];
    this.matches = [];
    this.resumeVersions = [];
    this.resumeHistory = [];
    this.applications = [];
    this.notifications = [];
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;
