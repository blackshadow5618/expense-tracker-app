
import React, { useCallback } from 'react';
import { Expense } from './types';
import { categorizeExpense } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import CategoryChart from './components/CategoryChart';

const App: React.FC = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);

  const handleAddExpense = useCallback(async (description: string, amount: number) => {
    try {
      const category = await categorizeExpense(description);
      const newExpense: Expense = {
        id: new Date().toISOString(),
        description,
        amount,
        category,
        date: new Date().toISOString(),
      };
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    } catch (error) {
      console.error("Failed to add expense:", error);
      throw error; // Re-throw to be caught by the form for UI feedback
    }
  }, [setExpenses]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content: Summary and Chart */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ExpenseSummary expenses={expenses} />
              <CategoryChart expenses={expenses} />
            </div>
            <ExpenseList expenses={expenses} />
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

export default App;
