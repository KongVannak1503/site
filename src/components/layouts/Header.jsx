import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Dropdown, Select, Layout } from 'antd';
import {
    FrownOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    SearchOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import getMenuItems from './MenuItems';
import { uploadImage } from '../apis/UploadImageApi';
import { handleLogout } from '../utils/Logout';
import { decodedToken } from '../apis/MainApi';
import { translate } from '../utils/Translations';

const HeaderComponent = ({ toggleCollapsed }) => {
    const { language, changeLanguage } = useLanguage();
    const [menuItems, setMenuItems] = useState(getMenuItems());
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setMenuItems(getMenuItems());
    }, [language]);

    const handleLanguageChange = (value) => {
        changeLanguage(value);
    };


    const flattenMenu = (items) => {
        return items.reduce((acc, item) => {
            if (item.path) {
                acc.push({ key: item.key, label: item.label, path: item.path });
            }
            if (item.children) {
                acc = acc.concat(flattenMenu(item.children));
            }
            return acc;
        }, []);
    };

    const flatMenu = useMemo(() => flattenMenu(menuItems), [menuItems]);
    const filteredItems = flatMenu.filter((item) =>
        (item.label && typeof item.label === 'string' && item.label.toLowerCase().includes((searchTerm || '').toLowerCase()))
    );

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleSelect = (path) => {
        navigate(path);
        setSearchTerm("");
    };


    const profileMenu = [
        {
            key: '1',
            label: (
                <span onClick={() => navigate(`/employees/view/${decodedToken.empId}`)} className="cursor-pointer">
                    <UserOutlined className="mr-2" /> {translate('profile')}
                </span>
            ),
        },
        { type: 'divider' },
        {
            key: '2',
            label: (
                <span onClick={() => handleLogout()}>
                    <LogoutOutlined className="mr-2" /> {translate('logout')}
                </span>
            ),
        },
    ];
    return (
        <Layout.Header style={{ display: 'flex', overflow: 'hidden', width: '100%', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingLeft: '5px', paddingRight: '5px', paddingTop: '0px', paddingBottom: '0px', height: '50px', lineHeight: "50px", }}>
            <div className='flex items-center'>
                <p
                    className="bg-transparent flex items-center bg-red-500 h-[40px] text-center border-none shadow-none cursor-pointer hover:bg-gray-200 px-3 rounded"
                    onClick={toggleCollapsed}
                >
                    <MenuFoldOutlined />
                </p>
                <div>
                    <img style={{ height: '55px' }} src={uploadImage('uploads/logo.png')} alt="" />
                </div>
            </div>
            <div >
                <Select
                    showSearch
                    value={searchTerm}
                    onSearch={handleSearch}
                    onChange={handleSelect}
                    filterOption={false}
                    className="absolute bg-white rounded p-2 py-1 w-64 max-h-[70vh] overflow-auto z-50 custom-scrollbar"
                    popupMatchSelectWidth={false}
                    style={{
                        marginTop: '5px',
                        border: 'none',
                        boxShadow: 'none',
                        outline: 'none',
                    }}
                    suffixIcon={<SearchOutlined style={{ color: "#aaa", fontSize: "16px" }} />}
                    notFoundContent={
                        <div className="flex items-center gap-2 px-2 py-1 text-gray-500">
                            <FrownOutlined style={{ fontSize: "16px" }} />
                            <span>Not Found</span>
                        </div>
                    }
                >
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <Select.Option key={item.key} value={item.path}>
                                {item.label}
                            </Select.Option>
                        ))
                    ) : (
                        <Select.Option key="not-found" value="not-found" disabled>
                            <FrownOutlined style={{ fontSize: "16px" }} /> Not Found
                        </Select.Option>
                    )}
                </Select>

            </div>
            <div className='flex items-center'>
                <div className='mx-4 mt-4'>
                    <Select
                        value={language}
                        onChange={handleLanguageChange}
                        className="w-[50px] py-1 rounded"
                        suffixIcon={null}
                        bordered={false}
                    >
                        <Option value="en" className=' px-0'>
                            <img src={uploadImage('uploads/en.png')} alt="English" className="" />
                        </Option>
                        <Option value="km"><img src={uploadImage('uploads/km.png')} alt="Khmer" className="" /></Option>
                    </Select>
                </div>

                <div>
                    <Dropdown
                        menu={{ items: profileMenu }} // Use the `menu` prop with the `items` array
                        placement="bottomRight"
                    >
                        <div className="flex items-center cursor-pointer">
                            <div className="mr-2">
                                <div className="m-0 leading-tight">{decodedToken.name}</div>
                                <p className="text-xs text-end text-gray-700 mb-0">{decodedToken.role}</p>
                            </div>
                            <Avatar size={40} src={''} />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </Layout.Header>
    );
};

export default HeaderComponent;