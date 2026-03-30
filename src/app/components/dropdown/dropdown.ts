import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output, signal } from '@angular/core';
import { DropdownItem } from '@/models/dropdown-item.model';

@Component({
  selector: 'fb-dropdown', // fb = FlowBite
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  icon = input.required<string>();
  label = input.required<string>();
  items = input.required<DropdownItem[]>();

  isToggled = signal(false)

  get chevronIcon() {
    return this.isToggled() ? 'heroicons:chevron-up-20-solid' : 'heroicons:chevron-down-20-solid';
  }

  toggleDropdown() {
    this.isToggled = signal(!this.isToggled());
  }

  onItemSelected = output<string>();
  onItemSelectedEvent(event: string) {
    this.onItemSelected.emit(event);
    this.isToggled = signal(false);
  }
}
