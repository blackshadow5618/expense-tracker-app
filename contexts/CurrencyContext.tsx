
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getExchangeRates } from '../services/currencyService';

interface CurrencyContextType {
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
  convert: (amount: number, fromCurrency: string) => number | null;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  loadingRates: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [baseCurrency, setBaseCurrency] = useLocalStorage<string>('baseCurrency', 'USD');
    const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
    const [loadingRates, setLoadingRates] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            setLoadingRates(true);
            const data = await getExchangeRates(baseCurrency);
            if (data) {
                setRates(data.rates);
            }
            setLoadingRates(false);
        };
        fetchRates();
    }, [baseCurrency]);

    const convert = useCallback((amount: number, fromCurrency: string): number | null => {
        if (!rates) return null;
        if (fromCurrency === baseCurrency) return amount;
        
        // The rate from the API is how many of the target currency you get for 1 base currency.
        // e.g., base=USD, rates[EUR] = 0.92 means 1 USD = 0.92 EUR.
        // To convert an amount FROM a foreign currency TO the base currency, we need to divide.
        // e.g., 10 EUR = 10 / 0.92 USD.
        const rate = rates[fromCurrency];
        if (rate) {
            return amount / rate;
        }
        
        console.warn(`No exchange rate found for ${fromCurrency} to convert to ${baseCurrency}`);
        return null; 
    }, [rates, baseCurrency]);

    const formatCurrency = useCallback((amount: number, currencyCode?: string) => {
        const code = currencyCode || baseCurrency;
        try {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: code,
            }).format(amount);
        } catch (error) {
            // Fallback for invalid currency codes
            console.error(`Invalid currency code: ${code}`, error);
            return `${code} ${amount.toFixed(2)}`;
        }
    }, [baseCurrency]);

    const value = { baseCurrency, setBaseCurrency, convert, formatCurrency, loadingRates };

    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
