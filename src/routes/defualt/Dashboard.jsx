import React from 'react';
import { Breadcrumb, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useLanguage } from '../../components/layouts/LanguageContext'; // Import the context
import { translate } from '../../components/utils/translations';

const Dashboard = () => {
    const { language, loading } = useLanguage();

    return (
        <Layout>
            <Breadcrumb
                items={[
                    {
                        title: translate('dashboard'), // Fetch translation dynamically
                    },
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
                <h2>{translate('dashboard')}</h2> {/* Use translation here */}
            </Content>
        </Layout>
    );
};

export default Dashboard;
