const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonDatabase {
  constructor(collectionName) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.collectionName = collectionName;
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  findAll(filter = {}) {
    let data = this._read();
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null && value !== '') {
        if (key === '$search') {
          const searchTerm = value.toLowerCase();
          data = data.filter(item =>
            item.name?.toLowerCase().includes(searchTerm) ||
            item.description?.toLowerCase().includes(searchTerm)
          );
        } else {
          data = data.filter(item => item[key] === value);
        }
      }
    }
    return data;
  }

  findById(id) {
    const data = this._read();
    return data.find(item => item.id === id) || null;
  }

  findOne(filter) {
    const data = this._read();
    return data.find(item => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    }) || null;
  }

  create(document) {
    const data = this._read();
    data.push(document);
    this._write(data);
    return document;
  }

  update(id, updates) {
    const data = this._read();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates };
    this._write(data);
    return data[index];
  }

  delete(id) {
    const data = this._read();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return false;
    data.splice(index, 1);
    this._write(data);
    return true;
  }

  deleteMany(filter) {
    let data = this._read();
    const initialLength = data.length;
    data = data.filter(item => {
      return !Object.entries(filter).every(([key, value]) => item[key] === value);
    });
    this._write(data);
    return initialLength - data.length;
  }

  count(filter = {}) {
    return this.findAll(filter).length;
  }
}

module.exports = JsonDatabase;
