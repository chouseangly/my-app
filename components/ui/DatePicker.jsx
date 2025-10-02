"use client";

import React, { useState, useRef, useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Default styles
import { CalendarIcon } from 'lucide-react';

const DatePicker = ({ selectedDate, onSelectDate, placeholder = "Select Date" }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const pickerRef = useRef(null);

    const handleDayClick = (day) => {
        onSelectDate(day);
        setIsPickerOpen(false);
    };

    const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            setIsPickerOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formattedDate = selectedDate && isValid(selectedDate) ? format(selectedDate, 'dd MMMM yyyy') : '';

    return (
        <div className="relative" ref={pickerRef}>
            <button
                type="button"
                onClick={() => setIsPickerOpen(!isPickerOpen)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-w-[120px] justify-between"
            >
                <CalendarIcon size={16} />
                <span>{formattedDate || placeholder}</span>
                {selectedDate && (
                    <span 
                        onClick={(e) => { e.stopPropagation(); onSelectDate(null); setIsPickerOpen(false); }}
                        className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                    >
                        &times;
                    </span>
                )}
            </button>
            {isPickerOpen && (
                <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-2 right-0 md:right-auto">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDayClick}
                        showOutsideDays
                        components={{
                            Caption: ({ displayMonth }) => (
                               <div className="flex justify-between items-center text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    <div className="text-sm font-bold">
                                        {format(displayMonth, 'MMMM yyyy')}
                                    </div>
                                </div>
                            )
                        }}
                        styles={{
                            caption: { display: 'flex', justifyContent: 'center' },
                            head_row: { display: 'flex', justifyContent: 'center' },
                            row: { display: 'flex', justifyContent: 'center' },
                            cell: { padding: '0.25rem' },
                            day_selected: { backgroundColor: 'rgb(59 130 246)', color: 'white' }, // bg-blue-500
                            day_today: { fontWeight: 'bold', color: 'rgb(59 130 246)' }, // text-blue-500
                        }}
                        className="p-4"
                    />
                </div>
            )}
        </div>
    );
};

export default DatePicker;