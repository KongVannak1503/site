// constants.js
import {
    PlusOutlined,
    SaveOutlined
} from "@ant-design/icons";

export const employeeTypes = [
    { name: 'Full-Time' },
    { name: 'Part-Time' },
    { name: 'Contractor' },
    { name: 'Intern' },
];

export const maritalStatuses = [
    { name: 'Single' },
    { name: 'Married' },
    { name: 'Divorced' },
    { name: 'Widowed' },
];

export const businessAddresses = [
    { name: 'Head Office' },
    { name: 'Branch Office' },
    { name: 'Remote Office' },
    { name: 'Warehouse' },
];

export const Salutation = [
    { name: "Mr." },
    { name: "Mrs." },
    { name: "Ms." },
    { name: "Dr." },
    { name: "Prof." }
];

export const Gender = [
    { name: "Male" },
    { name: "Female" }
];

export const noticePeriods = [
    { name: '15 Days' },
    { name: '30 Days' },
    { name: '45 Days' },
    { name: '60 Days' },
    { name: '75 Days' },
    { name: '90 Days' },
    { name: 'More than 90 Days' }
];
export const applicationSources = [
    { name: 'Facebook' },
    { name: 'Instagram' },
    { name: 'LinkedIn' },
    { name: 'Twitter' },
    { name: 'TikTok' },
    { name: 'YouTube' },
    { name: 'Snapchat' },
    { name: 'WhatsApp' },
    { name: 'Other' }
];

export const jobLocations = [
    { name: 'Remote', value: 'remote' },
    { name: 'New York', value: 'new_york' },
    { name: 'San Francisco', value: 'san_francisco' },
    { name: 'London', value: 'london' },
    { name: 'Berlin', value: 'berlin' },
    { name: 'Paris', value: 'paris' },
    { name: 'Tokyo', value: 'tokyo' }
];

export const totalExperience = [
    { name: '0 - 1 years' },
    { name: '1 - 3 years' },
    { name: '3 - 5 years' },
    { name: '5 - 7 years' },
    { name: '7 - 10 years' },
    { name: '10+ years' }
];
export const jobTypes = [
    { name: 'Full Time' },
    { name: 'Part Time' },
    { name: 'Contract' },
    { name: 'Freelance' },
    { name: 'Internship' },
    { name: 'Temporary' },
    { name: 'Remote' },
    { name: 'Onsite' },
    { name: 'Commission' },
    { name: 'Volunteer' },
];

export const applicationStatuses = [
    { name: 'Applied', color: 'blue' },
    { name: 'Under Review', color: 'orange' },
    { name: 'Interview Scheduled', color: 'green' },
    { name: 'Interview Completed', color: 'purple' },
    { name: 'Hired', color: 'teal' },
    { name: 'Rejected', color: 'red' },
];

export const defaultStatuses = [
    { name: 'Active', value: true, color: 'green' },
    { name: 'Inactive', value: false, color: 'red' },
];

export const openStatuses = [
    { value: true, name: 'Open', color: '#003369' },
    { value: false, name: 'Closed', color: '#d54443' },
];


export const NEW_USER = (
    <span>
        <PlusOutlined className="mr-2" />
    </span>
);
export const NEW_QUICK = (
    <span>
        <PlusOutlined className="mr-2" /> New Quick Form
    </span>
);
export const SAVE_ICON = (
    <span>
        <SaveOutlined className="mr-2" />
    </span>
);
export const EDIT_USER = 'Update';

export const PAGINATION_TITLE = 'entries';
export const PAGINATION_SPACE = ' to ';


export const interviewType = [
    { name: 'In Person' },
    { name: 'Video' },
    { name: 'Phone' },
];
export const remindType = [
    { name: 'Day(s)', value: 1 },
    { name: 'Hour(s)', value: 2 },
    { name: 'Minute(s)', value: 3 },
];