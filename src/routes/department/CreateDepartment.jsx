import React, { useState } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import { createDepartmentApi } from "../../components/apis/DepartmentApi";


const CreateDepartment = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createDepartmentApi(formData);
            message.success('User created successfully!');
            onUserCreated(response.data);
        } catch (error) {
            message.error(error.message || "Failed to create designation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
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
                <Switch defaultChecked />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} >
                Save
            </Button>
            <Button onClick={onClose} className="ml-3">
                Cancel
            </Button>
        </Form>
    );
};

export default CreateDepartment;
