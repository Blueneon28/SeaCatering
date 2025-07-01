// Simple localStorage-based database simulation
export class LocalStorage {
  static get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static set<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static add<T extends { id: string }>(key: string, item: T): void {
    const items = this.get<T>(key);
    items.push(item);
    this.set(key, items);
  }

  static update<T extends { id: string }>(
    key: string,
    id: string,
    updates: Partial<T>
  ) {
    const items: T[] = LocalStorage.get<T>(key);
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem(key, JSON.stringify(updatedItems));
  }

  static delete<T extends { id: string }>(key: string, id: string): void {
    const items = this.get<T>(key);
    const filtered = items.filter((item) => item.id !== id);
    this.set(key, filtered);
  }

  static findById<T extends { id: string }>(
    key: string,
    id: string
  ): T | undefined {
    const items = this.get<T>(key);
    return items.find((item) => item.id === id);
  }

  static findByField<T>(
    key: string,
    field: keyof T,
    value: any
  ): T | undefined {
    const items = this.get<T>(key);
    return items.find((item) => item[field] === value);
  }
}
