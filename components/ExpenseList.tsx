import React from 'react';
import { Expense } from '../types';
import { CategoryIcon } from './icons/CategoryIcons';
import { useCurrency } from '../contexts/CurrencyContext';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EmptyIllustration = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,110 L90,110 A10,10 0 0,0 100,100 L100,30 A10,10 0 0,0 90,20 L30,20 A10,10 0 0,0 20,30 L20,100 A10,10 0 0,0 30,110" className="fill-gray-100 dark:fill-slate-700/50" />
        <path d="M30,20 L90,20 A10,10 0 0,1 100,30 L100,32 L20,32 L20,30 A10,10 0 0,1 30,20" className="fill-gray-200 dark:fill-slate-600" />
        <circle cx="35" cy="26" r="3" className="fill-gray-300 dark:fill-slate-500" />
        <circle cx="45" cy="26" r="3" className="fill-gray-300 dark:fill-slate-500" />
        <rect x="35" y="50" width="50" height="8" rx="4" className="fill-gray-200 dark:fill-slate-600" />
        <rect x="35" y="70" width="30" height="8" rx="4" className="fill-gray-200 dark:fill-slate-600" />
        <path d="M10,40 L110,40 A5,5 0 0,1 115,45 L115,95 A5,5 0 0,1 110,100 L10,100 A5,5 0 0,1 5,95 L5,45 A5,5 0 0,1 10,40" transform="rotate(10, 60, 70)" className="fill-white dark:fill-slate-800" stroke="currentColor" strokeWidth="2" />
        <path d="M20 70 L 100 70" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="stroke-gray-300 dark:stroke-slate-600" transform="rotate(10, 60, 70)" />
        <path d="M40 85 L 40 55 L 60 65 L 80 50 L 80 85 Z" className="fill-brand-primary/20 dark:fill-brand-primary/30 stroke-brand-primary" strokeWidth="2" transform="rotate(10, 60, 70)" />
    </svg>
);


const ExpenseListItem: React.FC<{ expense: Expense; onDeleteExpense: (id: string) => void }> = ({ expense, onDeleteExpense }) => {
  const { formatCurrency } = useCurrency();
  
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedAmount = formatCurrency(expense.amount, expense.currency);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDeleteExpense(expense.id);
    }
  };

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:shadow-lg hover:-translate-y-px">
      <div className="flex items-center space-x-4 min-w-0">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20 rounded-full text-brand-primary dark:text-indigo-400">
          <CategoryIcon category={expense.category} className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{expense.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category} &bull; {formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 flex-shrink-0">
        <p className="font-bold text-lg text-gray-900 dark:text-gray-100 whitespace-nowrap">{formattedAmount}</p>
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
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Transactions</h2>
      {expenses.length === 0 ? (
        <div className="text-center py-12">
            <EmptyIllustration className="mx-auto h-32 w-32 text-gray-300 dark:text-slate-600" />
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