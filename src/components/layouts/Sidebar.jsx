import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext'; // Import the context hook
import getMenuItems from './MenuItems'; // Dynamically fetch menu items
import { handleLogout } from '../utils/Logout';

const SidebarComponent = () => {
    const { language } = useLanguage(); // Consume language from context
    const [menuItems, setMenuItems] = useState(getMenuItems(language)); // Initialize menu items based on language
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    // Update menu items when language changes
    useEffect(() => {
        setMenuItems(getMenuItems(language)); // Re-fetch menu items when the language changes
    }, [language]); // Add language as a dependency to re-fetch menu items when it changes

    // Find the active menu key based on the current path
    const findActiveKey = (items) => {
        for (let item of items) {
            if (item.path === currentPath) return [item.key];
            if (item.children) {
                const activeKey = findActiveKey(item.children);
                if (activeKey.length) return activeKey;
            }
        }
        return [];
    };

    const activeKey = findActiveKey(menuItems);

    // Handle menu clicks
    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            handleLogout();
        } else {
            const clickedItem = findMenuItemByKey(menuItems, e.key);
            if (clickedItem && clickedItem.path) {
                navigate(clickedItem.path);
            }
        }
    };

    // Find a menu item by its key
    const findMenuItemByKey = (items, key) => {
        for (let item of items) {
            if (item.key === key) return item;
            if (item.children) {
                const foundItem = findMenuItemByKey(item.children, key);
                if (foundItem) return foundItem;
            }
        }
        return null;
    };

    return (
        <Menu
            mode="inline"
            selectedKeys={activeKey}
            theme="dark"
            style={{
                height: '100%',
                borderRight: 0,
            }}
            items={menuItems}
            onClick={handleMenuClick}
            className="custom-sidebar"
        />
    );
};

export default SidebarComponent;
