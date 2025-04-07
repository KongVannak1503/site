import React, { createContext, useState, useContext, useEffect } from 'react';
import { Spin } from 'antd';

// Create a context for language
export const LanguageContext = createContext();

// Custom hook to use the LanguageContext
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

// LanguageProvider component to wrap around App and provide the language state
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [loading, setLoading] = useState(false);

    // Function to change the language
    const changeLanguage = (newLanguage) => {
        setLoading(true);  // Show the spinner
        setTimeout(() => {
            setLanguage(newLanguage);  // Change the language after 1 second
            localStorage.setItem('language', newLanguage);
            setLoading(false);  // Hide the spinner
        }, 500); // 1 second delay before updating the language
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, loading }}>
            {loading && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                    }}
                >
                    <Spin size="large" />
                </div>
            )}
            {children}
        </LanguageContext.Provider>
    );
};
