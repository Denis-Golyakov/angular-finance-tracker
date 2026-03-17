import { computed } from '@angular/core';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState
} from '@ngrx/signals';
import { Category } from '@/models/category.model';
import seedCategories from '@/data/categories.seed.json';

export const CategoryStore = signalStore(
    { providedIn: 'root' },
    withState({
        items: seedCategories as Category[],
        isLoading: false
    }),
    withComputed((store) => ({
        totalCount: computed(() => store.items().length)
    })),
    withMethods((store) => ({ // Common methods
        findById(id: string): Category | undefined {
            return store.items().find((item) => item.id === id)
        }
    })),
    withMethods((store) => ({
        add(categoryData: Omit<Category, 'id' | 'isDefault'>): void {
            const category: Category = {
                id: crypto.randomUUID(),
                isDefault: false,
                ...categoryData
            }
            patchState(store, { items: [...store.items(), category] })
        },
        remove(id: string): boolean {
            const item = store.findById(id)
            if (typeof item === 'undefined' || item.isDefault) {
                return false;
            }

            patchState(store, { items: store.items().filter((item) => item.id !== id) })
            return true
        },
        update(id: string, changes: Partial<Omit<Category, 'id' | 'isDefault'>>): boolean {
            const item = store.findById(id)
            if (typeof item === 'undefined' || item.isDefault) {
                return false;
            }

            patchState(store, {
                items: store.items().map((category) => category.id === id ? { ...category, ...changes } : category)
            });
            return true
        }
    }))
);
