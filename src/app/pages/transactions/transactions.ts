import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { fromUnixTime, format, getUnixTime, parse } from "date-fns";

import { CategoryStore } from '@/stores/category.store';
import { TransactionStore } from '@/stores/transaction.store';

import { Transaction } from '@/models/transaction.model';
import { DropdownItem } from '@/models/dropdown-item.model';

import { Dropdown } from '@/components/dropdown/dropdown';
import { TransactionModal } from '@/components/transaction-modal/transaction-modal';
import { PromptModal } from '@/components/prompt-modal/prompt-modal';

@Component({
  selector: 'app-transactions',
  imports: [CurrencyPipe, Dropdown, FormsModule, PromptModal, TransactionModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions {
  readonly store = inject(TransactionStore)
  readonly categoryStore = inject(CategoryStore)

  transactionList = computed(() =>
    this.store.items()
      .map((item) => ({
        ...item,
        category: this.categoryStore.findById(item.categoryId),
        date: format(fromUnixTime(parseInt(item.date)), 'dd MMM yyyy')
      }))
      .filter((item) =>
        this.filterByType() === 'all' || item.type === this.filterByType()
      )
      .filter((item) =>
        this.filterByDescription() === '' || item.description.toLowerCase().includes(this.filterByDescription().toLowerCase())
      )
  )

  filterByTypeItems: DropdownItem[] = [
    { label: 'All', event: 'all' },
    { label: 'Income', event: 'income' },
    { label: 'Expense', event: 'expense' },
  ]
  filterByType = signal('all')
  filterByTypeLabel = computed(() =>
    `Type: ${this.filterByTypeItems.find((item) => item.event === this.filterByType())?.label}`
  )

  filterByDescription = signal('')

  setFilterByType(type: string) {
    this.filterByType.set(type)
  }

  showNewTransactionModal() {
    this.modalTitle.set('New Transaction')
    this.modalFormId.set('')
    this.modalFormData.set(null)
    this.modalVisible.set(true)
  }

  editTransaction(id: string) {
    this.modalTitle.set('Edit Transaction')
    this.modalFormId.set(id)
    let transaction = this.store.findById(id)
    if (typeof transaction !== 'undefined') {
      let { id: _, ...trimmedTransaction } = transaction
      trimmedTransaction.date = format(fromUnixTime(parseInt(trimmedTransaction.date)), 'yyyy-MM-dd')
      this.modalFormData.set(trimmedTransaction)
    }
    this.modalVisible.set(true)
  }

  closeModal() {
    this.modalVisible.set(false)
  }

  modalVisible = signal(false)
  modalTitle = signal('')
  modalFormId = signal('')
  modalFormData = signal<Omit<Transaction, 'id'> | null>(null)

  saveTransactionData(data: Omit<Transaction, 'id'>) {
    data.date = getUnixTime(parse(data.date, 'yyyy-MM-dd', new Date())).toString();

    if (this.modalFormId() !== '') {
      this.store.update(this.modalFormId(), data)
    } else {
      this.store.add(data)
    }
    this.closeModal()
  }

  promptVisible = signal(false)
  promptId = signal('')

  confirmDeleteTransaction(id: string) {
    this.promptId.set(id)
    this.promptVisible.set(true)
  }

  closePrompt() {
    this.promptVisible.set(false)
    this.promptId.set('')
  }

  deleteTransaction() {
    this.store.remove(this.promptId())
    this.closePrompt()
  }
}
