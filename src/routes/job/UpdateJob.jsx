import React, { useState, useEffect } from 'react';
import { message, Form, Input, Button, Select, Checkbox } from 'antd';
import { applicationSources, applicationStatuses, noticePeriods, totalExperience } from '../../components/utils/Constants';
import { updateJobApplicationApi, viewJobApplicationApi } from '../../components/apis/JobApplicationApi';
import { getSkillApi } from '../../components/apis/SkillApi';

const UpdateJob = ({ userId, onUserUpdated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchApplicationData = async () => {
            try {
                const response = await viewJobApplicationApi(userId);
                const application = response.data;

                form.setFieldsValue(application);

                const JobData = await getSkillApi();
                const activeJob = JobData.filter((des) => des.isActive);
                setJobs(activeJob);
            } catch (error) {
                message.error('Failed to fetch job application data');
                console.error(error);
            }
        };

        fetchApplicationData();
    }, [userId, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await updateJobApplicationApi(userId, values);
            message.success('Job application updated successfully!');
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error('Failed to update job application');
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <Form layout="vertical" form={form} onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item
                    label="Jobs"
                    name="skillId"
                    rules={[{ required: true, message: "Please enter jobs" }]}
                >
                    <Select
                        placeholder="Select a job"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {jobs.map((cate) => (
                            <Select.Option key={cate._id} value={cate._id}>
                                {cate.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter name" }]}
                >
                    <Input placeholder="e.g John Doe" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please enter email" }]}
                >
                    <Input placeholder="example@gmail.com" />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: "Please enter phone" }]}
                >
                    <Input placeholder="e.g 987654321" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item
                    label="Location"
                    name="location"
                    rules={[{ required: true, message: "Please enter location" }]}
                >
                    <Input placeholder="e.g " />
                </Form.Item>

                <Form.Item
                    label="Total Experience"
                    name="experience"
                    rules={[{ required: true, message: "Please enter experience" }]}
                >
                    <Select
                        placeholder="Select experience"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {totalExperience.map((cate) => (
                            <Select.Option key={cate.name} value={cate.name}>
                                {cate.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Current Location"
                    name="currentLocation"
                    rules={[{ required: true, message: "Please enter current location" }]}
                >
                    <Input placeholder="e.g Phnom Penh" />
                </Form.Item>

                <Form.Item
                    label="Notice Period"
                    name="period"
                    rules={[{ required: true, message: "Please enter notice period" }]}
                >
                    <Select
                        placeholder="Select a period"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {noticePeriods.map((cate) => (
                            <Select.Option key={cate.name} value={cate.name}>
                                {cate.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: "Please enter status" }]}
                >
                    <Select
                        placeholder="Select a status"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {applicationStatuses.map((status) => (
                            <Select.Option key={status.name} value={status.name}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Application Source"
                    name="applicationSource"
                    rules={[{ required: true, message: "Please enter Application Source" }]}
                >
                    <Select
                        placeholder="Select an Application Source"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {applicationSources.map((cate) => (
                            <Select.Option key={cate.name} value={cate.name}>
                                {cate.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <Form.Item
                label="Cover Letter"
                name="coverLetter"
            >
                <Input.TextArea placeholder="Cover Letter" />
            </Form.Item>

            <div className="mb-4">
                <Form.Item name="isEmail" valuePropName="checked" noStyle>
                    <Checkbox>Send Email Notification to Job Application</Checkbox>
                </Form.Item>
            </div>

            <Button type="primary" htmlType="submit" loading={loading}>
                Save
            </Button>
            <Button onClick={onClose} className="ml-3">
                Cancel
            </Button>
        </Form>
    );
};

export default UpdateJob;