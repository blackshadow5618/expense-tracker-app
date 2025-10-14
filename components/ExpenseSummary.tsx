
import React, { useMemo } from 'react';
import { Expense } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DatePicker from './DatePicker';
import { useCurrency } from '../contexts/CurrencyContext';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  const { convert, formatCurrency, loadingRates } = useCurrency();
  const [selectedDateString, setSelectedDateString] = useLocalStorage<string>(
    'selectedDate',
    new Date().toISOString()
  );

  const selectedDate = useMemo(() => new Date(selectedDateString), [selectedDateString]);
  
  const handleDateChange = (date: Date) => {
    setSelectedDateString(date.toISOString());
  };
  
  const convertedExpenses = useMemo(() => {
    if (loadingRates || !convert) return [];
    return expenses
      .map(expense => {
        const convertedAmount = convert(expense.amount, expense.currency);
        return { ...expense, amount: convertedAmount ?? 0 };
      })
      .filter(e => e.amount > 0);
  }, [expenses, convert, loadingRates]);


  const monthlyTotal = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    return convertedExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [convertedExpenses, selectedDate]);

  const yearlyTotal = useMemo(() => {
    const selectedYear = selectedDate.getFullYear();
    return convertedExpenses
      .filter(expense => new Date(expense.date).getFullYear() === selectedYear)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [convertedExpenses, selectedDate]);

  const averageDailySpend = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    if (monthlyTotal === 0) return 0;
    return monthlyTotal / daysInMonth;
  }, [selectedDate, monthlyTotal]);

  const formattedTitleDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  
  const formattedMonth = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
  });

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors">
       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2 sm:mb-0 whitespace-nowrap">
          Spending for {formattedTitleDate}
        </h3>
        <div className="w-full sm:w-48">
          <DatePicker selectedDate={selectedDate} onChange={handleDateChange} />
        </div>
      </div>
      
      <div className={`transition-opacity duration-300 ${loadingRates ? 'opacity-50' : 'opacity-100'}`}>
        <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {loadingRates ? '...' : formatCurrency(monthlyTotal)}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">Total for {formattedMonth}</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{formatCurrency(monthlyTotal)}</p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">Avg. Daily Spend</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{formatCurrency(averageDailySpend)}</p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">Total for {selectedDate.getFullYear()}</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{formatCurrency(yearlyTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;