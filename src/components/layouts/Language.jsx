import React, { createContext, useContext, useState, useEffect } from 'react';
import translationsMenu from './utils/Translations'; // Import your translations

// Create the context
const LanguageContext = createContext();

// Custom hook to use language context
export const useLanguage = () => {
    return useContext(LanguageContext);
};

// Language provider component
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    // Change language and store it in localStorage
    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'km' : 'en';
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage); // Save the selected language
    };

    const translatedMenu = translationsMenu[language];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, translatedMenu }}>
            {children}
        </LanguageContext.Provider>
    );
};
