import React, { useEffect } from 'react';

const CenterSlideModal = ({ isOpen, onClose, children, title }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[999] top-[-17px] bg-opacity-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.73)', }}>
            <div className="bg-white rounded-lg shadow-lg w-180 max-h-[96vh] overflow-hidden">
                <div className="bg-blue-custom text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{title || 'Modal Title'}</h2>
                    <button
                        onClick={onClose}
                        className="text-white text-2xl cursor-pointer hover:text-gray-200 focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default CenterSlideModal;