import React from 'react';
import { Category } from '../types';
import { Filters } from '../App';
import { useToast } from '../contexts/ToastContext';

interface ExpenseFilterProps {
  filters: Filters;
  onFilterChange: React.Dispatch<React.SetStateAction<Filters>>;
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({ filters, onFilterChange }) => {
  const { addToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all filters?')) {
      onFilterChange({
          search: '',
          category: '',
          startDate: '',
          endDate: '',
      });
      addToast({ message: 'Filters reset.', type: 'info' });
    }
  };

  const hasActiveFilters = filters.search || filters.category || filters.startDate || filters.endDate;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <input
            type="text"
            name="search"
            id="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="e.g., Groceries from store"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors"
          />
        </div>

        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={filters.category}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md transition-colors"
          >
            <option value="">All Categories</option>
            {Object.values(Category).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={filters.startDate}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={filters.endDate}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
            <button
                onClick={handleReset}
                className="text-sm font-medium text-brand-primary hover:text-indigo-700 focus:outline-none"
            >
                Reset Filters
            </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilter;