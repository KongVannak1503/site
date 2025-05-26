import React, { useState, useEffect } from "react";
import { Form, Input, Switch, message, DatePicker } from "antd";
import { Styles } from "../../../components/utils/CustomStyle";
import { updateJobPositionApi, viewJobPositionApi } from "../../../components/apis/JobPositionApi";
import ReactQuill from "react-quill";
import dayjs from "dayjs";

const UpdateJobPosition = ({ userId, onUserUpdated, onClose }) => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");

    // Populate form with existing values when editing
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await viewJobPositionApi(userId);
                const data = response.data;
                setSummary(data.description || "");
                form.setFieldsValue({
                    name: data.name,
                    description: data.description,
                    startDate: data.startDate ? dayjs(data.startDate) : null, // Convert to dayjs
                    endDate: data.endDate ? dayjs(data.endDate) : null,
                    isActive: data.isActive,
                });
            } catch (error) {
                message.error('Failed to fetch user data');
                console.error('Error:', error);
            }
        };
        fetchUserData();
    }, [userId, form]);

    const onFinish = async (formData) => {
        try {
            setLoading(true);

            const response = await updateJobPositionApi(userId, formData);
            message.success("Job position updated successfully!");
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to update Job position.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Name Input */}
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
            >
                <Input placeholder="Enter name" autoFocus />
            </Form.Item>
            <div>
                <Form.Item name="description" label="Description" required>
                    <ReactQuill theme="snow" value={summary} onChange={setSummary} />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: "Start Date is required" }]}
                    >
                        <DatePicker className="w-full" placeholder="Select Start Date" format="YYYY-MM-DD" />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: "End Date is required" }]}
                    >
                        <DatePicker className="w-full" placeholder="Select End Date" format="YYYY-MM-DD" />
                    </Form.Item>
                </div>
            </div>

            <Form.Item label="Active Status" name="isActive" valuePropName="checked">
                <Switch defaultChecked />
            </Form.Item>
            {/* Submit and Cancel Buttons */}
            <button className={Styles.btnUpdate} type='submit' loading={loading}>
                Update
            </button>
            <button className={Styles.btnCancel} onClick={onClose} style={{ marginLeft: 10 }}>
                Cancel
            </button>
        </Form>
    );
};

export default UpdateJobPosition;
