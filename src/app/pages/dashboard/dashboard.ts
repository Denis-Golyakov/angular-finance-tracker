import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject, signal, ViewChild } from '@angular/core';

import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import colors from '@/data/colors.json';
import { BudgetStore } from '@/stores/budget.store';
import { TransactionStore } from '@/stores/transaction.store';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Category } from '@/models/category.model';

Chart.defaults.color = '#ccd3df';

@Component({
  selector: 'app-dashboard',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BaseChartDirective,
    CurrencyPipe,
    DecimalPipe
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  readonly budgetStore = inject(BudgetStore);
  readonly transactionStore = inject(TransactionStore);

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          borderRadius: 0,
          boxWidth: 12
        }
      }
    },
  };
  public pieChartData = computed(() => {
    const transactions = this.transactionStore.getFormattedItems('asc', 'expense');
    let labels = [] as string[];
    let data = [] as number[];
    let backgroundColors = [] as string[];
    let categoriesData = {} as Record<string, { object: Category | undefined; amount: number }>;

    transactions.forEach((transaction) => {
      if (categoriesData.hasOwnProperty(transaction.categoryId)) {
        categoriesData[transaction.categoryId].amount += transaction.amount;
      } else {
        categoriesData[transaction.categoryId] = {
          object: transaction.category,
          amount: transaction.amount
        };
      }
    });

    Object.keys(categoriesData).forEach((key) => {
      labels.push(categoriesData[key].object?.name || '');
      data.push(categoriesData[key].amount);
      const color = colors.find((color) => color.class === categoriesData[key].object?.color);
      if (color) {
        backgroundColors.push(color.hex);
      }
    });

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors
        },
      ],
    } as ChartData;
  });

  monthlyIncomeBreakdownVisible = signal(false)
  monthlyExpensesBreakdownVisible = signal(false)

  toggleMonthlyIncomeBreakdown() {
    this.monthlyIncomeBreakdownVisible.set(!this.monthlyIncomeBreakdownVisible());
  }

  toggleMonthlyExpensesBreakdown() {
    this.monthlyExpensesBreakdownVisible.set(!this.monthlyExpensesBreakdownVisible());
  }

  recentTransactions = computed(() => {
    return this.transactionStore.getFormattedItems('desc', 'all', '', 10);
  })

  constructor() {
    effect(() => {
      this.pieChartData();
      this.chart?.update();
    })
  }
}
