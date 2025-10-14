
import React from 'react';
import { Expense } from '../types';
import { CategoryIcon } from './icons/CategoryIcons';

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseListItem: React.FC<{ expense: Expense }> = ({ expense }) => {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-full text-brand-primary">
          <CategoryIcon category={expense.category} className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{expense.description}</p>
          <p className="text-sm text-gray-500">{expense.category} &bull; {formattedDate}</p>
        </div>
      </div>
      <p className="font-bold text-lg text-gray-900">${expense.amount.toFixed(2)}</p>
    </li>
  );
};


const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
      {expenses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No expenses logged yet.</p>
          <p className="text-gray-400 text-sm mt-1">Add an expense to get started!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sortedExpenses.map((expense) => (
            <ExpenseListItem key={expense.id} expense={expense} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
