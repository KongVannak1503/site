import { Menu } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ employee }) => {
    const location = useLocation();

    const items = [
        { key: `/employees/view`, label: <Link to={`/employees/view/${employee?._id}`}>Profile</Link> },
        { key: `/employees/task`, label: <Link to={`/employees/task/${employee?._id}`}>Task</Link> },
        { key: `/employees/attendance`, label: <Link to={`/employees/attendances/${employee?._id}`}>Attendance</Link> },
        { key: "/contact", label: <Link to="/contact">Contact</Link> },
    ];

    // Find the item that matches the current path
    const selectedKey = items.find(item => location.pathname.startsWith(item.key))?.key;

    return (
        <div>
            <Menu mode="horizontal" selectedKeys={[selectedKey]}>
                {items.map((item) => (
                    <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
            </Menu>
        </div>
    );
};

export default Header;
