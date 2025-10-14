
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <svg className="h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.75A.75.75 0 0 1 3 4.5h.75m0 0h.75A.75.75 0 0 1 4.5 6v.75m0 0v.75A.75.75 0 0 1 3.75 8.25h-.75m0 0h-.75A.75.75 0 0 1 2.25 7.5V6.75m0 0V6A.75.75 0 0 1 3 5.25h.75M15 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.75c0 .414-.168.79-.438 1.062a4.48 4.48 0 0 1-1.125.75c-.337.15-1.062.438-1.062.438s-.725-.288-1.062-.438a4.48 4.48 0 0 1-1.125-.75c-.27-.272-.438-.648-.438-1.062a4.5 4.5 0 0 1 4.5-4.5 4.5 4.5 0 0 1 4.5 4.5v.75m-8.25-1.5h6.375" />
                </svg>
                <h1 className="text-3xl font-bold text-gray-900">Expense Tracker Pro</h1>
            </div>
            <p className="text-sm text-gray-500 hidden md:block">Powered by <span className="font-semibold text-brand-primary">Gemini</span></p>
        </div>
      </div>
    </header>
  );
};

export default Header;
