import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { addMonths, endOfMonth, isBefore, format, parse } from "date-fns";

import { BudgetItem } from '@/models/budget.model';

import { CategoryStore } from '@/stores/category.store';

@Component({
  selector: 'budget-modal',
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './budget-modal.html',
  styleUrl: './budget-modal.scss',
})
export class BudgetModal {
  title = input.required<string>();
  data = input.required<Omit<BudgetItem, 'id'> | null>();

  readonly categoryStore = inject(CategoryStore)

  categoryId = '';
  name = '';
  daterange_start_month = signal(1);
  daterange_start_year = signal(2026);
  daterange_end_month = signal(2);
  daterange_end_year = signal(2026);
  amount: number | null = null;

  startMonthList = computed(() => {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();

    const startMonthList = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1);
      if (year === this.daterange_start_year() && date.getMonth() < month) {
        continue
      }
      startMonthList.push({
        label: format(date, 'MMMM'),
        value: i + 1,
      });
    }
    return startMonthList;
  });

  endMonthList = computed(() => {
    const endMonthList = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(this.daterange_end_year(), i, 1);
      if (
        this.daterange_start_year() === this.daterange_end_year() &&
        date.getMonth() < (this.daterange_start_month() - 1)
      ) {
        continue
      }
      endMonthList.push({
        label: format(date, 'MMMM'),
        value: i + 1,
      });
    }
    return endMonthList;
  });

  startYearList = computed(() => {
    const date = new Date();
    const year = date.getFullYear();
    const startYearList = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(year + i, 0, 1);
      startYearList.push({
        label: format(date, 'yyyy'),
        value: date.getFullYear(),
      });
    }
    return startYearList;
  });

  endYearList = computed(() => {
    const date = new Date();
    const year = date.getFullYear() < this.daterange_start_year()
      ? this.daterange_start_year() : date.getFullYear();
    const endYearList = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(year + i, 0, 1);
      endYearList.push({
        label: format(date, 'yyyy'),
        value: date.getFullYear(),
      });
    }
    return endYearList;
  })

  onClose = output<void>();
  onCloseEvent = () => this.onClose.emit();

  ngOnInit() {
    const data = this.data();
    if (data !== null) {
      this.categoryId = data.categoryId;
      this.name = data.name;
      this.amount = data.amount;

      const startDate = parse(data.daterange_start, 'yyyy-MM-dd', new Date());
      const endDate = parse(data.daterange_end, 'yyyy-MM-dd', new Date());
      this.daterange_start_month.set(startDate.getMonth() + 1);
      this.daterange_start_year.set(startDate.getFullYear());
      this.daterange_end_month.set(endDate.getMonth() + 1);
      this.daterange_end_year.set(endDate.getFullYear());
    } else {
      let date = new Date();
      this.daterange_start_month.set(date.getMonth() + 1);
      this.daterange_start_year.set(date.getFullYear());
      this.daterange_end_month.set(date.getMonth() + 1);
      this.daterange_end_year.set(date.getFullYear());
    }
  }

  constructor() {
    effect(() => {
      const startDate = new Date(this.daterange_start_year(), this.daterange_start_month() - 1, 1);
      const endDate = new Date(this.daterange_end_year(), this.daterange_end_month() - 1, 1);

      if (isBefore(endDate, startDate)) {
        const corrected = addMonths(startDate, 1);
        untracked(() => {
          this.daterange_end_month.set(corrected.getMonth() + 1);
          this.daterange_end_year.set(corrected.getFullYear());
        });
      }
    });
  }

  onSave = output<Omit<BudgetItem, 'id'>>();
  onSaveEvent() {
    if (!this.name || !this.categoryId || !this.amount) {
      return
    }

    let daterange_start = format(new Date(
      this.daterange_start_year(),
      this.daterange_start_month() - 1,
      1
    ), 'yyyy-MM-dd');
    let daterange_end = format(endOfMonth(new Date(
      this.daterange_end_year(),
      this.daterange_end_month() - 1,
      1
    )), 'yyyy-MM-dd');

    this.onSave.emit({
      categoryId: this.categoryId,
      name: this.name,
      daterange_start: daterange_start,
      daterange_end: daterange_end,
      amount: this.amount ?? 0,
    });
  }
}
