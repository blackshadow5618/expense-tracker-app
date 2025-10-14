import React, { useCallback, useMemo, useState } from 'react';
import { Expense, Category } from './types';
import { categorizeExpense } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import CategoryChart from './components/CategoryChart';
import ExpenseFilter from './components/ExpenseFilter';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';

export interface Filters {
  search: string;
  category: Category | '';
  startDate: string;
  endDate: string;
}

const AppContent: React.FC = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const { addToast } = useToast();

  const handleAddExpense = useCallback(async (description: string, amount: number) => {
    try {
      const category = await categorizeExpense(description);
      const newExpense: Expense = {
        id: new Date().toISOString() + Math.random(), // Add random number to ensure unique ID
        description,
        amount,
        category,
        date: new Date().toISOString(),
      };
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
      addToast({ message: 'Expense added successfully!', type: 'success' });
    } catch (error) {
      console.error("Failed to add expense:", error);
      addToast({ message: 'Failed to add expense.', type: 'error' });
      throw error; // Re-throw to be caught by the form for UI feedback
    }
  }, [setExpenses, addToast]);

  const handleDeleteExpense = useCallback((id: string) => {
    setExpenses(prevExpenses => {
      const newExpenses = prevExpenses.filter(expense => expense.id !== id);
      addToast({ message: 'Expense deleted.', type: 'info' });
      return newExpenses;
    });
  }, [setExpenses, addToast]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      
      // Search filter
      if (filters.search && !expense.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      // Category filter
      if (filters.category && expense.category !== filters.category) {
        return false;
      }
       // Date range filter
      if (filters.startDate) {
        // Start date is inclusive, so we compare from the beginning of the day.
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (expenseDate < startDate) {
            return false;
        }
      }
      if (filters.endDate) {
        // End date is inclusive, so we compare until the end of the day.
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (expenseDate > endDate) {
            return false;
        }
      }
      return true;
    });
  }, [expenses, filters]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content: Summary and Chart */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ExpenseSummary expenses={filteredExpenses} />
              <CategoryChart expenses={filteredExpenses} />
            </div>
            <ExpenseFilter filters={filters} onFilterChange={setFilters} />
            <ExpenseList expenses={filteredExpenses} onDeleteExpense={handleDeleteExpense} />
          </div>

          {/* Sidebar: Add Expense Form */}
          <div className="md:col-span-1">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
        </div>
      </main>
    </div>
  );
}


const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </ThemeProvider>
    )
}

export default App;