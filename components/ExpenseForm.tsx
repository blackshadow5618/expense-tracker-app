
import React from 'react';
import CurrencySelector from './CurrencySelector';
import { useCurrency } from '../contexts/CurrencyContext';

interface ExpenseFormProps {
  onAddExpense: (description: string, amount: number, date: string, currency: string) => Promise<void>;
}

const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset*60*1000));
    return todayWithOffset.toISOString().split('T')[0];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(getTodayString());
  const { baseCurrency } = useCurrency();
  const [currency, setCurrency] = React.useState(baseCurrency);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Sync form currency if global base currency changes
  React.useEffect(() => {
    setCurrency(baseCurrency);
  }, [baseCurrency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !currency) {
      setError('Please fill in all fields.');
      return;
    }
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      await onAddExpense(description, amountNumber, date, currency);
      setDescription('');
      setAmount('');
      setDate(getTodayString());
      setCurrency(baseCurrency);
    } catch (e) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Coffee with a friend"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors"
            disabled={isLoading}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 4.50"
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors"
                    disabled={isLoading}
                />
            </div>
             <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currency
                </label>
                <CurrencySelector 
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled={isLoading}
                />
            </div>
        </div>
         <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors [color-scheme:light] dark:[color-scheme:dark]"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Categorizing...
            </>
          ) : (
            'Add Expense'
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;