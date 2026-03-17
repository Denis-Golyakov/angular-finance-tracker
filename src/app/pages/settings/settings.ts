import { inject } from '@angular/core';
import { Component } from '@angular/core';

import { CategoryStore } from '@/stores/category.store';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  readonly store = inject(CategoryStore);
}
