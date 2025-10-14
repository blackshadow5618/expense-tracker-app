
export interface ExchangeRates {
    base_code: string;
    rates: { [key: string]: number };
    time_last_update_unix: number;
}

const CACHE_KEY_PREFIX = 'exchangeRates_';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const getExchangeRates = async (baseCurrency: string): Promise<ExchangeRates | null> => {
    const cacheKey = `${CACHE_KEY_PREFIX}${baseCurrency}`;
    try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const parsedData: ExchangeRates = JSON.parse(cachedData);
            // Check if cache is still valid
            if (Date.now() - (parsedData.time_last_update_unix * 1000) < CACHE_DURATION_MS) {
                return parsedData;
            }
        }

        const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.result === 'success') {
            const ratesData: ExchangeRates = {
                base_code: data.base_code,
                rates: data.rates,
                time_last_update_unix: data.time_last_update_unix
            };
            localStorage.setItem(cacheKey, JSON.stringify(ratesData));
            return ratesData;
        } else {
             throw new Error(`API error: ${data['error-type']}`);
        }
    } catch (error) {
        console.error("Error getting exchange rates:", error);
        // Attempt to return stale cache if fetch fails
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return null;
    }
}
