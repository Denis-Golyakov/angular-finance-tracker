import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

import { Category } from '@/models/category.model';
import colors from '@/data/colors.json';
import { ColorSelectItem } from '@/components/color-select-item/color-select-item';
import { CategoryIconSearch } from '@/components/category-icon-search/category-icon-search';

@Component({
  selector: 'category-form',
  imports: [
    CategoryIconSearch,
    ColorSelectItem,
    FormsModule,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
    NgSelectModule
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm {
  categoryFormData = input<Omit<Category, 'id' | 'isDefault'>>({ name: '', color: '', icon: '' })

  readonly colors = colors

  name: string = '';
  selectedColor = colors[0].class
  icon: string = '';

  ngOnInit() {
    this.name = this.categoryFormData().name;
    this.selectedColor = this.categoryFormData().color;
    this.icon = this.categoryFormData().icon!;
  }

  iconChange(icon: string) {
    this.icon = icon;
  }

  onSubmit = output<Omit<Category, 'id' | 'isDefault'>>();
  onSubmitEvent() {
    this.onSubmit.emit({
      name: this.name,
      color: this.selectedColor,
      icon: this.icon
    });
  }
}
