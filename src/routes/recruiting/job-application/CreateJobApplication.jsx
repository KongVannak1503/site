import React, { useEffect, useState } from "react";
import { Form, Input, message, Select, Checkbox } from "antd";
import { createJobApplicationApi } from "../../../components/apis/JobApplicationApi";
import { getSkillApi } from "../../../components/apis/SkillApi";
import { applicationSources, applicationStatuses, noticePeriods, totalExperience } from "../../../components/utils/Constants";
import { Styles } from "../../../components/utils/CustomStyle";

const CreateJobApplication = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const JobData = await getSkillApi();
                const activeJob = JobData.filter((des) => des.isActive);
                setJobs(activeJob);

            } catch (error) {
                message.error(error.message || "Failed to fetch categories.");
            }
        };

        fetchCategories();
    }, []);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createJobApplicationApi(formData);
            message.success('Job application created successfully!');
            onUserCreated(response.data);
        } catch (error) {
            message.error(error.message || "Failed to create job application.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            {/* Name Input */}
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
                    {/* <Select
                        placeholder="Select a location"
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
                    </Select> */}
                </Form.Item>

                <Form.Item
                    label="Total Experience"
                    name="experience"
                    rules={[{ required: true, message: "Please enter experience" }]}
                >
                    <Select
                        placeholder="Select a experience"
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
                                <div className="flex items-center gap-2">
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor: status.color, // Using the color defined for each status
                                        }}
                                    />
                                    <span>{status.name}</span>
                                </div>
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
                        placeholder="Select a Application Source"
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
            {/* isActive Switch */}


            <button type="submit" className={Styles.btnCreate} loading={loading} >
                Save
            </button>
            <button onClick={onClose} className={Styles.btnCancel}>
                Cancel
            </button>
        </Form>
    );
};

export default CreateJobApplication;
