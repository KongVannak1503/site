import {
    UserOutlined, LaptopOutlined, NotificationOutlined,
    DashboardOutlined, SettingOutlined, LogoutOutlined
} from '@ant-design/icons';
import { handleLogout } from '../utils/Logout';
import { getLanguage, translate } from '../utils/translations'; // Import dynamic translation functions

const getMenuItems = () => {
    const language = getLanguage(); // Get current language

    return [
        { key: 'sub1', icon: <DashboardOutlined />, label: translate('dashboard'), path: '/dashboard' },
        {
            key: 'employee',
            icon: <UserOutlined />,
            label: translate('employees'),
            path: '/employees'
        },

        {
            key: 'sub6',
            icon: <NotificationOutlined />,
            label: translate('recruit'),
            children: [
                { key: '19', label: translate('jobs'), path: '/jobs' },
                { key: '20', label: translate('jobApplications'), path: '/job-application' },
                { key: 'job-position', label: translate('jobPositions'), path: '/job-positions' },
                { key: '21', label: translate('interviewSchedules'), path: '/interview-schedule' },
                { key: '25', label: translate('reports'), path: '/recruit-report' },
            ],
        },
        {
            key: 'sub10',
            icon: <LaptopOutlined />,
            label: translate('work'),
            children: [
                { key: '14', label: translate('project'), path: '/projects' },
                { key: '15', label: translate('payrollReports'), path: '/payroll/reports' },
                { key: '16', label: translate('tax'), path: '/payroll/tax' },
                { key: '17', label: translate('deductions'), path: '/payroll/deductions' },
            ],
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: translate('settings'),
            children: [
                {
                    label: translate('userAndRole'),
                    children: [
                        { key: 'user', label: translate('users'), path: '/users' },
                        { key: 'role', label: translate('roles'), path: '/roles' },
                    ],
                },
                {
                    label: translate('category'),
                    children: [
                        { key: '18', label: translate('category'), path: '/category' },
                        { key: 'subCategory', label: translate('subCategoryLabel'), path: '/sub-category' },
                    ],
                },
                { key: '23', label: translate('skills'), path: '/skills' },
                { key: 'round', label: translate('rounds'), path: '/round' },
                { key: 'designation', label: translate('designation'), path: '/designations' },
                { key: 'department', label: translate('department'), path: '/departments' },
            ],
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: translate('logout'),
            onClick: handleLogout
        },
    ];
};

export default getMenuItems;
