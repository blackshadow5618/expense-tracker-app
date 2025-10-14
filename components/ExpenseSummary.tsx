import React from 'react';
import { Expense, Category } from '../types';
import DatePicker from './DatePicker';
import CurrencySelector from './CurrencySelector';
import { useCurrency } from '../contexts/CurrencyContext';

interface ExpenseSummaryProps {
  expenses: Expense[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const ArrowUpIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);

const ArrowDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses, selectedDate, onDateChange }) => {
  const { convert, formatCurrency, loadingRates, baseCurrency, setBaseCurrency } = useCurrency();

  const handleDateChange = (date: Date) => {
    onDateChange(date);
  };
  
  const convertedExpenses = React.useMemo(() => {
    if (loadingRates || !convert) return [];
    return expenses
      .map(expense => {
        const convertedAmount = convert(expense.amount, expense.currency);
        if (convertedAmount === null) {
            return null;
        }
        // Return a new object with the correct type
        const newExpense: Expense = { ...expense, amount: convertedAmount };
        return newExpense;
      })
      .filter((e): e is Expense => e !== null);
  }, [expenses, convert, loadingRates]);


  const monthlyTotal = React.useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    return convertedExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [convertedExpenses, selectedDate]);
  
  const previousMonthTotal = React.useMemo(() => {
    const prevMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevMonthYear = prevMonthDate.getFullYear();
    
    return convertedExpenses
        .filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevMonthYear;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
  }, [convertedExpenses, selectedDate]);

  const spendingChange = React.useMemo(() => {
    if(previousMonthTotal === 0 && monthlyTotal > 0) return { percent: 100, type: 'increase' as const };
    if(previousMonthTotal === 0) return null;
    
    const percent = ((monthlyTotal - previousMonthTotal) / previousMonthTotal) * 100;
    if(Math.abs(percent) < 0.01) return null;
    
    return {
        percent: Math.abs(percent),
        type: percent > 0 ? 'increase' as const : 'decrease' as const
    };
  }, [monthlyTotal, previousMonthTotal]);

  const topCategory = React.useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const categoryTotals = convertedExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
      })
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<Category, number>);

    if (Object.keys(categoryTotals).length === 0) return null;

    return Object.entries(categoryTotals).reduce((top, current) => 
        current[1] > top[1] ? current : top
    )[0];
  }, [convertedExpenses, selectedDate]);


  const yearlyTotal = React.useMemo(() => {
    const selectedYear = selectedDate.getFullYear();
    return convertedExpenses
      .filter(expense => new Date(expense.date).getFullYear() === selectedYear)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [convertedExpenses, selectedDate]);

  const formattedTitleDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors flex flex-col justify-between h-full">
       <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2 sm:mb-0 whitespace-nowrap">
              Financial Snapshot
            </h3>
            <div className="w-full sm:w-48">
              <DatePicker selectedDate={selectedDate} onChange={handleDateChange} />
            </div>
        </div>
        
        <div className={`transition-opacity duration-300 ${loadingRates ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Spending for {formattedTitleDate}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mt-1">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {loadingRates ? '...' : formatCurrency(monthlyTotal)}
                </p>
                <div className="w-full sm:w-40">
                    <label htmlFor="snapshot-currency" className="sr-only">Display Currency</label>
                    <CurrencySelector
                        id="snapshot-currency"
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value)}
                        disabled={loadingRates}
                        className="w-full pl-2 pr-8 py-1 text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-gray-100 rounded-md focus:ring-brand-primary focus:border-brand-primary transition-colors"
                    />
                </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
                {spendingChange && (
                    <div className="flex items-center space-x-2">
                        {spendingChange.type === 'increase' ? (
                            <ArrowUpIcon className="h-4 w-4 text-red-500" />
                        ) : (
                            <ArrowDownIcon className="h-4 w-4 text-green-500" />
                        )}
                        <p className={`font-medium ${spendingChange.type === 'increase' ? 'text-red-500' : 'text-green-500'}`}>
                           {spendingChange.percent.toFixed(0)}%
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                           {spendingChange.type} from last month
                        </p>
                    </div>
                )}
                {topCategory && monthlyTotal > 0 && (
                     <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <span>Your top category is <span className="font-semibold text-brand-primary">{topCategory}</span>.</span>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <div className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${loadingRates ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">Total for {selectedDate.getFullYear()}</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{formatCurrency(yearlyTotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;