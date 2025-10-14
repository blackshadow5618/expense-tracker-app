
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Expense, Category } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

interface CategoryChartProps {
  expenses: Expense[];
}

const COLORS: { [key in Category]: string } = {
  [Category.Groceries]: '#10b981',
  [Category.DiningOut]: '#f97316',
  [Category.Transport]: '#3b82f6',
  [Category.Shopping]: '#8b5cf6',
  [Category.Entertainment]: '#ec4899',
  [Category.Utilities]: '#f59e0b',
  [Category.Health]: '#ef4444',
  [Category.Travel]: '#06b6d4',
  [Category.Education]: '#6366f1',
  [Category.Other]: '#6b7280',
};

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CategoryChart: React.FC<CategoryChartProps> = ({ expenses }) => {
  const { convert, formatCurrency, loadingRates } = useCurrency();
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-700 p-2 border border-gray-200 dark:border-gray-600 rounded-md shadow-md">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{`${payload[0].name}`}</p>
          <p className="text-gray-700 dark:text-gray-200">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const chartData = useMemo(() => {
    if (loadingRates || !convert) return [];

    const categoryTotals = expenses.reduce((acc, expense) => {
      const convertedAmount = convert(expense.amount, expense.currency);
      if (convertedAmount !== null) {
        acc[expense.category] = (acc[expense.category] || 0) + convertedAmount;
      }
      return acc;
    }, {} as { [key in Category]?: number });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name: name as Category,
      value: value || 0,
    }));
  }, [expenses, convert, loadingRates]);

  const total = useMemo(() => {
    return chartData.reduce((sum, entry) => sum + entry.value, 0);
  }, [chartData]);

  const renderLegendText = (value: string) => {
    const item = chartData.find(data => data.name === value);
    if (!item || total === 0) {
      return <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>;
    }
    const percent = (item.value / total) * 100;
    const displayPercent = percent < 1 && percent > 0 ? '<1' : percent.toFixed(0);

    return <span className="text-sm text-gray-700 dark:text-gray-300">{value} ({displayPercent}%)</span>;
  };

  if (loadingRates) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-full transition-colors">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading chart data...</p>
      </div>
    );
  }

  if (expenses.length === 0 || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center justify-center h-full transition-colors">
         <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">No data for chart.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Your spending breakdown will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md h-full transition-colors">
      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-4">Spending by Category</h3>
      <div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconSize={12}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ paddingLeft: '20px' }}
              formatter={renderLegendText}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;