import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly prefix = 'aft.';

  private getStorageKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to local storage', e);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getStorageKey(key));
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from local storage', e);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(key));
    } catch (e) {
      console.error('Error removing from local storage', e);
    }
  }

  clearItems(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error('Error clearing local storage', e);
    }
  }
}
