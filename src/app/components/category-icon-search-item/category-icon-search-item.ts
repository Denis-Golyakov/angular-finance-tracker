import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

@Component({
  selector: 'category-icon-search-item',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './category-icon-search-item.html',
  styleUrl: './category-icon-search-item.scss',
})
export class CategoryIconSearchItem {
  readonly item = input.required<string | undefined>()
}
