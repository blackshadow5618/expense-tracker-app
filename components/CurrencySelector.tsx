
import React from 'react';
import { CURRENCIES } from '../constants/currencies';

interface CurrencySelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, id, name, className, disabled }) => {
  const defaultClassName = "mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md transition-colors";

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={className || defaultClassName}
      disabled={disabled}
    >
      {Object.entries(CURRENCIES).map(([code, name]) => (
        <option key={code} value={code}>
          {code} - {name}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;
