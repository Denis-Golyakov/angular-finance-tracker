import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject, untracked } from '@angular/core';
import {
    patchState,
    signalStore,
    withComputed,
    withHooks,
    withMethods,
    withState
} from '@ngrx/signals';

import { Category } from '@/models/category.model';
import seedCategories from '@/data/categories.seed.json';

import { StorageService } from '@/services/storage.service';

const STORAGE_CATEGORY_KEY = 'categories';

export const CategoryStore = signalStore(
    { providedIn: 'root' },

    withDevtools('categories'),

    withState({
        items: seedCategories as Category[],
        isLoading: false
    }),

    withComputed((store) => ({
        totalCount: computed(() => store.items().length)
    })),

    withMethods((store) => ({ // Common methods
        setLoading(status: boolean): void {
            patchState(store, { isLoading: status })
        },
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
    })),

    withHooks((store) => {
        const storage = inject(StorageService);

        return {
            onInit() {
                const savedCategories = storage.getItem<Category[]>(STORAGE_CATEGORY_KEY);
                if (savedCategories) {
                    patchState(store, { items: savedCategories })
                }

                effect(() => {
                    const items = store.items()

                    untracked(() => {
                        store.setLoading(true);
                        storage.setItem(STORAGE_CATEGORY_KEY, items);
                        store.setLoading(false);
                    })
                });
            }
        }
    })
);
