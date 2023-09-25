import { existsSync, readFileSync, writeFile } from "fs";

class Store {
  constructor(path) {
    this.filePath = `src/store/${path}.json`;
    this.content = {};

    if (existsSync(this.filePath)) {
      const storeText = readFileSync(this.filePath, "utf-8");
      try {
        this.content = JSON.parse(storeText);
      } catch (_) {}
    }
  }

  get(key) {
    return this.content[key] ?? null;
  }

  where(predicate) {
    const result = [];
    for (const [_, value] of Object.entries(this.content)) {
      if (predicate(value)) {
        result.push(value);
      }
    }
    return result;
  }

  set(key, value) {
    this.content[key] = value;
  }

  startSaveInterval() {
    const store = this;
    setInterval(() => {
      store.save();
    }, 30000);
  }

  save() {
    writeFile(this.filePath, JSON.stringify(this.content));
  }
}

export const EMPLOYEE_STORE = new Store("employee");
