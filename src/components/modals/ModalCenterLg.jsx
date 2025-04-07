import React from 'react';

const CenterSlideModalLg = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[999] bg-opacity-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.73)' }}>
            <div className="bg-white rounded-lg shadow-lg w-250 max-h-[96vh] overflow-hidden">
                {/* Fixed header */}
                <div className="bg-blue-custom text-white px-4 py-2 rounded-t-lg flex justify-between items-center sticky top-0">
                    <h2 className="text-xl font-semibold">{title || 'Modal Title'}</h2>
                    <button
                        onClick={onClose}
                        className="text-white text-2xl cursor-pointer hover:text-gray-200 focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                {/* Render dynamic content via children */}
                <div className="overflow-auto max-h-[80vh] p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CenterSlideModalLg;