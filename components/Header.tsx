
import React from 'react';
import ThemeToggle from './ThemeToggle';
import CurrencySelector from './CurrencySelector';
import { useCurrency } from '../contexts/CurrencyContext';

const Header: React.FC = () => {
  const { baseCurrency, setBaseCurrency, loadingRates } = useCurrency();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md transition-colors border-b border-slate-200 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.75A.75.75 0 0 1 3 4.5h.75m0 0h.75A.75.75 0 0 1 4.5 6v.75m0 0v.75A.75.75 0 0 1 3.75 8.25h-.75m0 0h-.75A.75.75 0 0 1 2.25 7.5V6.75m0 0V6A.75.75 0 0 1 3 5.25h.75M15 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.75c0 .414-.168.79-.438 1.062a4.48 4.48 0 0 1-1.125.75c-.337.15-1.062.438-1.062.438s-.725-.288-1.062-.438a4.48 4.48 0 0 1-1.125-.75c-.27-.272-.438-.648-.438-1.062a4.5 4.5 0 0 1 4.5-4.5 4.5 4.5 0 0 1 4.5 4.5v.75m-8.25-1.5h6.375" />
                </svg>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Expense Tracker Pro</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">Powered by <span className="font-semibold text-brand-primary">Gemini</span></p>
                <div className="w-48 sm:w-52">
                  <CurrencySelector
                      value={baseCurrency}
                      onChange={(e) => setBaseCurrency(e.target.value)}
                      disabled={loadingRates}
                      className="w-full pl-2 pr-8 py-1 text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  />
                </div>
                <ThemeToggle />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;