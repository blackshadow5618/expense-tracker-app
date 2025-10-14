import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category, Filters } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { categorizeExpense } from './services/geminiService';

import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import CategoryChart from './components/CategoryChart';
import ExpenseFilter from './components/ExpenseFilter';
import DataActions from './components/DataActions';
import Reports from './components/Reports';
import EditExpenseModal from './components/EditExpenseModal';

import { ThemeProvider } from './contexts/ThemeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ToastProvider, useToast } from './contexts/ToastContext';

const AppContent: React.FC = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = React.useState('transactions');
  
  const [selectedDateString, setSelectedDateString] = useLocalStorage<string>(
    'selectedDate',
    new Date().toISOString()
  );
  const selectedDate = React.useMemo(() => new Date(selectedDateString), [selectedDateString]);
  const handleDateChange = (date: Date) => {
    setSelectedDateString(date.toISOString());
  };

  const handleAddExpense = async (description: string, amount: number, date: string, currency: string) => {
    try {
      const category = await categorizeExpense(description);
      const newExpense: Expense = {
        id: uuidv4(),
        description,
        amount,
        category,
        date,
        currency,
      };
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
      addToast({ message: 'Expense added successfully!', type: 'success' });
    } catch (error) {
      console.error("Failed to add expense:", error);
      addToast({ message: 'Error adding expense.', type: 'error' });
      throw error; // re-throw to be caught in form
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
    addToast({ message: 'Expense deleted.', type: 'info' });
  };
  
  const handleStartEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    addToast({ message: 'Expense updated successfully!', type: 'success' });
    setEditingExpense(null);
  };

  const handleImportExpenses = (importedExpenses: Expense[]) => {
    const existingIds = new Set(expenses.map(e => e.id));
    const newExpenses = importedExpenses.filter(e => !existingIds.has(e.id));
    
    if (newExpenses.length === 0) {
      addToast({ message: 'No new expenses to import.', type: 'info' });
      return;
    }

    setExpenses(prev => [...prev, ...newExpenses]);
    addToast({ message: `${newExpenses.length} new expenses imported successfully!`, type: 'success'});
  };

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      // Adjust for timezone differences by only comparing date parts
      if (startDate) startDate.setUTCHours(0, 0, 0, 0);
      if (endDate) endDate.setUTCHours(23, 59, 59, 999);
      
      const searchMatch = expense.description.toLowerCase().includes(filters.search.toLowerCase());
      const categoryMatch = filters.category ? expense.category === filters.category : true;
      const startDateMatch = startDate ? expenseDate >= startDate : true;
      const endDateMatch = endDate ? expenseDate <= endDate : true;
      
      return searchMatch && categoryMatch && startDateMatch && endDateMatch;
    });
  }, [expenses, filters]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans transition-colors">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-6">
            <ExpenseForm onAddExpense={handleAddExpense} />
            <DataActions expenses={expenses} onImport={handleImportExpenses} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpenseSummary expenses={expenses} selectedDate={selectedDate} onDateChange={handleDateChange} />
              <CategoryChart expenses={expenses} selectedDate={selectedDate} />
            </div>
            
            <div>
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'transactions'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Recent Transactions
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'reports'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Spending Reports
                  </button>
                </nav>
              </div>

              <div className="mt-6">
                {activeTab === 'transactions' && (
                  <div className="space-y-6">
                    <ExpenseFilter filters={filters} onFilterChange={setFilters} />
                    <ExpenseList 
                      expenses={filteredExpenses} 
                      onDeleteExpense={handleDeleteExpense}
                      onEditExpense={handleStartEdit}
                    />
                  </div>
                )}
                {activeTab === 'reports' && (
                  <Reports expenses={expenses} selectedDate={selectedDate} />
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
      {editingExpense && (
        <EditExpenseModal 
          expense={editingExpense}
          onSave={handleUpdateExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <ToastProvider>
           <AppContent />
        </ToastProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;