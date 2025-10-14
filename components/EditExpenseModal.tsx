import React from 'react';
import { Expense, Category } from '../types';
import CurrencySelector from './CurrencySelector';

interface EditExpenseModalProps {
  expense: Expense;
  onSave: (updatedExpense: Expense) => void;
  onClose: () => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, onSave, onClose }) => {
  const [description, setDescription] = React.useState(expense.description);
  const [amount, setAmount] = React.useState(String(expense.amount));
  const [date, setDate] = React.useState(expense.date);
  const [currency, setCurrency] = React.useState(expense.currency);
  const [category, setCategory] = React.useState(expense.category);
  const [error, setError] = React.useState('');
  
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        onClose();
       }
    };
    window.addEventListener('keydown', handleEsc);
    
    // Animate modal entrance
    requestAnimationFrame(() => {
        if (modalRef.current) {
            modalRef.current.style.opacity = '1';
            modalRef.current.style.transform = 'scale(1)';
        }
    });

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !currency || !category) {
        setError('All fields are required.');
        return;
    }
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
        setError('Please enter a valid amount.');
        return;
    }

    onSave({
      ...expense, // keeps the original ID
      description,
      amount: amountNumber,
      date,
      currency,
      category,
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300" 
      onClick={onClose} 
      aria-modal="true" 
      role="dialog"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg m-4 transform transition-all duration-300 opacity-0 scale-95" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Expense</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <input type="text" id="edit-description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                    <input type="number" id="edit-amount" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <div>
                    <label htmlFor="edit-currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                    <CurrencySelector id="edit-currency" value={currency} onChange={e => setCurrency(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                  <input type="date" id="edit-date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                   <select id="edit-category" value={category} onChange={e => setCategory(e.target.value as Category)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;