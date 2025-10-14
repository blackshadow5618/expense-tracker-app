import React from 'react';
import { Expense } from '../types';
import { CategoryIcon } from './icons/CategoryIcons';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EmptyStateIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M12 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M3 7.5h18M4.5 12h15M4.5 16.5h15" />
    </svg>
);


const ExpenseListItem: React.FC<{ expense: Expense; onDeleteExpense: (id: string) => void }> = ({ expense, onDeleteExpense }) => {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDeleteExpense(expense.id);
    }
  };

  return (
    <li className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-full text-brand-primary dark:text-indigo-400">
          <CategoryIcon category={expense.category} className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">{expense.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category} &bull; {formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <p className="font-bold text-lg text-gray-900 dark:text-gray-100">${expense.amount.toFixed(2)}</p>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500 transition-colors"
          aria-label={`Delete expense: ${expense.description}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
};


const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Transactions</h2>
      {expenses.length === 0 ? (
        <div className="text-center py-12">
            <EmptyStateIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                Your transaction list is empty
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add a new expense using the form to get started.
            </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sortedExpenses.map((expense) => (
            <ExpenseListItem key={expense.id} expense={expense} onDeleteExpense={onDeleteExpense} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;