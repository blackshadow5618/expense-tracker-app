
import React from 'react';
import { Expense } from '../types';
import { exportToCSV, importFromCSV } from '../services/csvService';
import { useToast } from '../contexts/ToastContext';

interface DataActionsProps {
  expenses: Expense[];
  onImport: (expenses: Expense[]) => void;
}

const DownloadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0L8 8m4-4v12" />
    </svg>
);

const DataActions: React.FC<DataActionsProps> = ({ expenses, onImport }) => {
  const { addToast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      exportToCSV(expenses);
      addToast({ message: 'Expenses exported successfully!', type: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      addToast({ message: `Export failed: ${message}`, type: 'error' });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedExpenses = await importFromCSV(file);
        onImport(importedExpenses);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not process file.';
        addToast({ message: `Import failed: ${message}`, type: 'error' });
      } finally {
        // Reset file input to allow importing the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Data Management</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExport}
          disabled={expenses.length === 0}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <DownloadIcon className="w-5 h-5 mr-2 -ml-1" />
          Export to CSV
        </button>
        <button
          onClick={handleImportClick}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
        >
          <UploadIcon className="w-5 h-5 mr-2 -ml-1" />
          Import from CSV
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default DataActions;