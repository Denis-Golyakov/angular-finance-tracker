import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { format, isSameMonth, isSameYear, parse } from "date-fns";

import { BudgetStore } from '@/stores/budget.store';
import { CategoryStore } from '@/stores/category.store';

import { BudgetModal } from '@/components/budget-modal/budget-modal';
import { PromptModal } from '@/components/prompt-modal/prompt-modal';
import { BudgetItem } from '@/models/budget.model';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-budget',
  imports: [
    BudgetModal,
    CurrencyPipe,
    DecimalPipe,
    FormsModule,
    PercentPipe,
    PromptModal
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './budget.html',
  styleUrl: './budget.scss',
})
export class Budget {
  readonly store = inject(BudgetStore)
  readonly categoryStore = inject(CategoryStore)

  itemList = computed(() =>
    this.store.items()
      .map((item) => ({
        ...item,
        category: this.categoryStore.findById(item.categoryId),
        daterangeString: this.parseItemDaterange(item),
        transactionsTotal: this.store.budgetTotals()[item.id]
      }))
  );

  parseItemDaterange(item: BudgetItem) {
    const start = parse(item.daterange_start, 'yyyy-MM-dd', new Date())
    const end = parse(item.daterange_end, 'yyyy-MM-dd', new Date())
    let result = ""

    if (isSameMonth(start, end)) {
      result = format(start, 'MMMM, yyyy')
    }
    else if (isSameYear(start, end)) {
      result = format(start, 'MMMM') + " - " + format(end, 'MMMM, yyyy')
    }
    else {
      result = format(start, 'MMM, yyyy') + " - " + format(end, 'MMM, yyyy')
    }

    return result
  }

  getProgressWidth(item: { transactionsTotal: number, amount: number }): number {
    return 1 - Math.min(item.transactionsTotal / item.amount, 1);
  }

  promptVisible = signal(false)
  promptId = signal('')

  confirmDeleteBudgetItem(id: string) {
    this.promptId.set(id)
    this.promptVisible.set(true)
  }

  closePrompt() {
    this.promptVisible.set(false)
    this.promptId.set('')
  }

  deleteBudgetItem() {
    this.store.remove(this.promptId())
    this.closePrompt()
  }

  modalVisible = signal(false)
  modalTitle = signal('')
  modalFormId = signal('')
  modalFormData = signal<Omit<BudgetItem, 'id'> | null>(null)

  closeModal() {
    this.modalVisible.set(false)
  }

  showNewBudgetItemModal() {
    this.modalTitle.set('New Budget')
    this.modalFormId.set('')
    this.modalFormData.set(null)
    this.modalVisible.set(true)
  }

  editBudgetItem(id: string) {
    this.modalTitle.set('Edit Budget')
    this.modalFormId.set(id)
    let budget_item = this.store.findById(id)
    if (typeof budget_item !== 'undefined') {
      let { id: _, ...trimmedBudgetItem } = budget_item
      this.modalFormData.set(trimmedBudgetItem)
    }
    this.modalVisible.set(true)
  }

  saveBudgetItemData(data: Omit<BudgetItem, 'id'>) {
    if (this.modalFormId() !== '') {
      this.store.update(this.modalFormId(), data)
    } else {
      this.store.add(data)
    }
    this.closeModal()
  }
}
