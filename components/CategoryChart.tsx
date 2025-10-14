
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Expense, Category } from '../types';

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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-md">
        <p className="font-semibold">{`${payload[0].name}`}</p>
        <p className="text-gray-700">{`$${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const CategoryChart: React.FC<CategoryChartProps> = ({ expenses }) => {
  const chartData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key in Category]?: number });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name: name as Category,
      value: value || 0,
    }));
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center h-full">
         <div className="text-center">
            <p className="text-gray-500">No data for chart.</p>
            <p className="text-gray-400 text-sm mt-1">Your spending breakdown will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-lg font-medium text-gray-500 mb-4">Spending by Category</h3>
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
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
