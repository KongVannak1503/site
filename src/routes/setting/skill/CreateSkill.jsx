import React, { useState } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import { createSkillApi } from "../../../components/apis/SkillApi";

const CreateSkill = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createSkillApi(formData);
            message.success('Skill created successfully!');
            onUserCreated(response.data);
        } catch (error) {
            message.error(error.message || "Failed to create skill.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            {/* Name Input */}
            <Form.Item
                label="Skill Name"
                name="name"
                rules={[{ required: true, message: "Please enter skill name" }]}
            >
                <Input placeholder="Enter skill name" autoFocus />
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

export default CreateSkill;
