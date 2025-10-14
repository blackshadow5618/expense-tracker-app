
import React from 'react';
import { Expense } from '../types';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const total = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium text-gray-500">This Month's Spending</h3>
      <p className="text-4xl font-bold text-gray-900 mt-2">${total.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseSummary;
