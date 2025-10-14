
import React from 'react';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(selectedDate.getFullYear());
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Close popover on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  // Reset view year when selected date changes from outside
  React.useEffect(() => {
    setViewYear(selectedDate.getFullYear());
  }, [selectedDate]);

  // Handle the opening animation
  React.useEffect(() => {
    if (isOpen && popoverRef.current) {
      // We use requestAnimationFrame to ensure the element has been painted before we start the transition.
      requestAnimationFrame(() => {
        if (popoverRef.current) {
          popoverRef.current.style.transform = 'scale(1)';
          popoverRef.current.style.opacity = '1';
        }
      });
    }
  }, [isOpen]);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewYear, monthIndex, 1);
    onChange(newDate);
    setIsOpen(false);
  };

  const selectedMonthForViewYear = selectedDate.getFullYear() === viewYear ? selectedDate.getMonth() : -1;
  const isSelectedYearInView = selectedDate.getFullYear() === viewYear;

  const formattedDisplayDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full pl-3 pr-2 py-1.5 text-base text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{formattedDisplayDate}</span>
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div
            ref={popoverRef}
            // Add a bounce effect to the animation by using a custom cubic-bezier timing function.
            style={{ transform: 'scale(0.95)', opacity: '0', transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 150ms ease-out' }}
            className="absolute z-10 right-0 mt-2 w-72 origin-top-right bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setViewYear(viewYear - 1)}
                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-primary dark:focus:ring-offset-slate-800 transition-colors"
                aria-label="Previous year"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {/* Highlight the year if it matches the selected date's year. */}
              <span className={`font-bold text-lg transition-colors ${isSelectedYearInView ? 'text-brand-primary' : 'text-gray-900 dark:text-gray-100'}`} aria-live="polite">
                {viewYear}
              </span>
              <button
                type="button"
                onClick={() => setViewYear(viewYear + 1)}
                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-primary dark:focus:ring-offset-slate-800 transition-colors"
                aria-label="Next year"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS_SHORT.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  // Improve visual contrast by making the hover state more subtle, making the selected state pop.
                  className={`py-2 px-1 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-primary transition-colors duration-150 ${
                    index === selectedMonthForViewYear
                      ? 'bg-brand-primary text-white font-semibold shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;