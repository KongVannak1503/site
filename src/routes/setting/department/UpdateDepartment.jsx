import React, { useState, useEffect } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import { updateDepartmentApi, viewDepartmentApi } from "../../../components/apis/DepartmentApi";

const UpdateDepartment = ({ userId, onUserUpdated, onClose }) => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [loading, setLoading] = useState(false);

    // Populate form with existing values when editing
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await viewDepartmentApi(userId);
                const data = response.data;
                form.setFieldsValue({
                    name: data.name,
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
            const response = await updateDepartmentApi(userId, formData);
            message.success("Designation updated successfully!");
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to update designation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Name Input */}
            <Form.Item
                label="Designation Name"
                name="name"
                rules={[{ required: true, message: "Please enter designation name" }]}
            >
                <Input placeholder="Enter designation name" autoFocus />
            </Form.Item>

            {/* isActive Switch */}
            <Form.Item label="Active Status" name="isActive" valuePropName="checked">
                <Switch />
            </Form.Item>

            {/* Submit and Cancel Buttons */}
            <Button type="primary" htmlType="submit" loading={loading}>
                Update
            </Button>
            <Button onClick={onClose} style={{ marginLeft: 10 }}>
                Cancel
            </Button>
        </Form>
    );
};

export default UpdateDepartment;
