import React from 'react';
import { Layout, Breadcrumb } from 'antd';

const { Content } = Layout;

const MainContent = () => {
    return (
        <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb
                items={[
                    { title: 'Home' },
                    { title: 'List' },
                    { title: 'App' },
                ]}
                style={{ margin: '16px 0' }}
            />
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: '#fff',
                    borderRadius: '8px',
                }}
            >
                Content
            </Content>
        </Layout>
    );
};

export default MainContent;