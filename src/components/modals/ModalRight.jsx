import React from 'react';

const RightSlideModal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] top-[-17px] bg-opacity-50 flex justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="w-96 bg-white h-full shadow-lg transform transition-transform duration-300 ease-in-out">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">{title || 'Right Slide Modal'}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default RightSlideModal;
