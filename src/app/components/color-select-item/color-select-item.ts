import { Component, computed, input } from '@angular/core';
import { Color } from '@/models/color.model';

@Component({
  selector: 'color-select-item',
  imports: [],
  templateUrl: './color-select-item.html',
  styleUrl: './color-select-item.scss',
})
export class ColorSelectItem {
  item = input.required<Color>()

  styleString = computed(() => {
    const color: Color = this.item();
    return `background-color: ${color.hex}`;
  })
}
