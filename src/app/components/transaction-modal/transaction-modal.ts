import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Transaction } from '@/models/transaction.model';

import { CategoryStore } from '@/stores/category.store';

@Component({
  selector: 'transaction-modal',
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.scss',
})
export class TransactionModal {
  title = input.required<string>();
  data = input.required<Omit<Transaction, 'id'> | null>();

  store = inject(CategoryStore);

  type: 'income' | 'expense' = 'expense';
  categoryId = '';
  date = '';
  amount: number | null = null;
  description = '';

  onClose = output<void>();
  onCloseEvent = () => this.onClose.emit();

  ngOnInit() {
    const data = this.data();
    if (data !== null) {
      this.type = data.type;
      this.categoryId = data.categoryId;
      this.date = data.date;
      this.amount = data.amount;
      this.description = data.description;
    }
  }

  onSave = output<Omit<Transaction, 'id'>>();
  onSaveEvent() {
    if (!this.type || !this.categoryId || !this.date || !this.amount || !this.description) {
      return
    }

    this.onSave.emit({
      type: this.type,
      categoryId: this.categoryId,
      date: this.date,
      amount: this.amount,
      description: this.description,
    });
  }
}
