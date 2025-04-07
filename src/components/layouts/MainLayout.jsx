import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderComponent from './Header';
import SidebarComponent from './Sidebar';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [title, setTitle] = useState('Dashboard'); // Default title
    const location = useLocation(); // Get the current route

    // Function to set title based on route
    useEffect(() => {
        const routeTitles = {
            '/': 'Home',
            '/about': 'About',
            '/dashboard': 'Dashboard',
        };

        setTitle(routeTitles[location.pathname] || 'Page Not Found');
    }, [location.pathname]);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const siderStyle = {
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
        paddingTop: 55,
    };
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Fixed Header */}
            <Header className="shadow-sm" style={{ position: 'fixed', height: "55px", zIndex: 999, width: '100%', backgroundColor: '#fff', paddingLeft: '10px', paddingRight: '10px' }}>
                <HeaderComponent toggleCollapsed={toggleCollapsed} />
            </Header>

            <Layout>
                {/* Sidebar */}
                <Sider
                    style={siderStyle}
                    width={200}
                    collapsedWidth={65}
                    collapsed={collapsed} className='pt-2' onCollapse={setCollapsed}>
                    <SidebarComponent />
                </Sider>

                {/* Content Area */}
                <Layout style={{ padding: '20px', paddingTop: 50 }}>
                    <Content>
                        <Outlet />  {/* This will render the child routes */}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
