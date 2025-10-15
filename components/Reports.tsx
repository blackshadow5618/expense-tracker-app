
import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Expense, Category } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface ReportsProps {
    expenses: Expense[];
    selectedDate: Date;
}

const Reports: React.FC<ReportsProps> = ({ expenses, selectedDate }) => {
  const [activeTab, setActiveTab] = React.useState('monthly');
  const [reportYear, setReportYear] = React.useState(new Date().getFullYear());
  const { convert, formatCurrency, loadingRates, baseCurrency } = useCurrency();
  const { theme } = useTheme();

  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  const convertedExpenses = React.useMemo(() => {
    if (loadingRates || !convert) return [];
    return expenses
      .map(expense => {
        const convertedAmount = convert(expense.amount, expense.currency);
        if (convertedAmount === null) {
            return null;
        }
        return { ...expense, amount: convertedAmount };
      })
      .filter((e): e is Expense => e !== null);
  }, [expenses, convert, loadingRates]);

  const monthlyBreakdownData = React.useMemo(() => {
    const yearExpenses = convertedExpenses.filter(e => new Date(e.date).getFullYear() === reportYear);
    const monthlyTotals = Array(12).fill(0);
    
    yearExpenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      monthlyTotals[month] += expense.amount;
    });

    return MONTHS_SHORT.map((month, index) => ({
      name: month,
      total: monthlyTotals[index],
    }));
  }, [convertedExpenses, reportYear]);

  const categoryDeepDiveData = React.useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    
    const monthExpenses = convertedExpenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const categoryStats = monthExpenses.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
            acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += expense.amount;
        acc[category].count += 1;
        return acc;
    }, {} as Record<Category, { total: number; count: number }>);

    return Object.entries(categoryStats)
        .map(([category, stats]) => ({
            category: category as Category,
            ...stats,
            average: stats.count > 0 ? stats.total / stats.count : 0,
        }))
        .sort((a, b) => b.total - a.total);
  }, [convertedExpenses, selectedDate]);

  const yoyComparisonData = React.useMemo(() => {
    const currentYear = reportYear;
    const previousYear = reportYear - 1;

    const currentYearTotals = Array(12).fill(0);
    const previousYearTotals = Array(12).fill(0);

    convertedExpenses.forEach(e => {
        const d = new Date(e.date);
        const year = d.getFullYear();
        const month = d.getMonth();

        if (year === currentYear) {
            currentYearTotals[month] += e.amount;
        } else if (year === previousYear) {
            previousYearTotals[month] += e.amount;
        }
    });

    return MONTHS_SHORT.map((month, index) => ({
      name: month,
      [currentYear]: currentYearTotals[index],
      [previousYear]: previousYearTotals[index],
    }));
  }, [convertedExpenses, reportYear]);
  
  const hasYoyData = yoyComparisonData.some(d => d[reportYear] > 0 || d[reportYear - 1] > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-700 p-2 border border-gray-200 dark:border-gray-600 rounded-md shadow-md text-sm">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.stroke || pld.fill }}>
              {`${pld.name}: ${formatCurrency(pld.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const renderNoData = (title: string, message: string) => (
    <div className="flex items-center justify-center h-80 text-center">
        <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">{title}</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Spending Reports</h2>
      </div>
      
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
          {['monthly', 'category', 'yearly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                activeTab === tab
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab === 'yearly' ? 'Yearly Comparison' : `${tab} Breakdown`}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab !== 'category' && (
          <div className="flex items-center justify-end mb-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mr-4">{reportYear}</h4>
            <div className="flex space-x-1">
              <button onClick={() => setReportYear(y => y - 1)} aria-label="Previous year" className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => setReportYear(y => y + 1)} aria-label="Next year" className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          monthlyBreakdownData.some(d => d.total > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBreakdownData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
                <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickFormatter={(value: number) => formatCurrency(value, baseCurrency).replace(/[\s,0-9]*\.?[0-9]+/, '') + (value / 1000).toFixed(0) + 'k'} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(203, 213, 225, 0.4)' }}/>
                <Bar dataKey="total" name="Total Spend" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            renderNoData(`No spending data for ${reportYear}`, "Your monthly spending totals will appear here.")
          )
        )}
        
        {activeTab === 'category' && (
          categoryDeepDiveData.length > 0 ? (
            <div className="overflow-x-auto">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                For {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Spent</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transactions</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg. Transaction</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {categoryDeepDiveData.map(({ category, total, count, average }) => (
                    <tr key={category}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{category}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right font-semibold">{formatCurrency(total)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">{count}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">{formatCurrency(average)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            renderNoData("No spending data for this month", "Your category breakdown will appear here.")
          )
        )}

        {activeTab === 'yearly' && (
          hasYoyData ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yoyComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
                <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickFormatter={(value: number) => formatCurrency(value, baseCurrency).replace(/[\s,0-9]*\.?[0-9]+/, '') + (value / 1000).toFixed(0) + 'k'} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: "12px"}} />
                <Line type="monotone" dataKey={reportYear - 1} stroke="#6b7280" name={`${reportYear-1} Total`} />
                <Line type="monotone" dataKey={reportYear} stroke="#4f46e5" name={`${reportYear} Total`} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            renderNoData(`No spending data for ${reportYear} or ${reportYear-1}`, "A comparison between years will appear here.")
          )
        )}

      </div>
    </div>
  );
};

export default Reports;