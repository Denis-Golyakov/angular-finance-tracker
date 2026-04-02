import { inject } from '@angular/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CategoryStore } from '@/stores/category.store';
import { Category } from '@/models/category.model';
import { CategoryForm } from '@/components/category-form/category-form';

@Component({
  selector: 'app-settings',
  imports: [CategoryForm],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  readonly store = inject(CategoryStore);

  private readonly defaultCategory: Omit<Category, 'id' | 'isDefault'> = {
    name: '',
    color: '',
    icon: ''
  }

  categoryFormData: Omit<Category, 'id' | 'isDefault'> = structuredClone(this.defaultCategory);

  categoryFormVisible: boolean = false;

  addCategory(formData: Omit<Category, 'id' | 'isDefault'>): void {
    this.store.add(formData)
    this.toggleCategoryForm()
    this.resetCategoryForm()
  }

  verifyFormData() {
    return (
      this.categoryFormData.name.length > 0 &&
      this.categoryFormData.color.length > 0
    )
  }

  deleteCategory(id: string) {
    this.store.remove(id)
  }

  resetCategoryForm() {
    this.categoryFormData = structuredClone(this.defaultCategory)
  }

  toggleCategoryForm() {
    this.categoryFormVisible = !this.categoryFormVisible
  }
}
