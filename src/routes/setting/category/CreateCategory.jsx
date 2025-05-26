import React, { useState } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import { createCategoryApi } from "../../../components/apis/CategoryApi";
import { Styles } from "../../../components/utils/CustomStyle";

const CreateCategory = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createCategoryApi(formData);
            message.success('User created successfully!');
            onUserCreated(response.data);
        } catch (error) {
            message.error(error.message || "Failed to create Category.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            {/* Name Input */}
            <Form.Item
                label="Category Name"
                name="name"
                rules={[{ required: true, message: "Please enter Category name" }]}
            >
                <Input placeholder="Enter Category name" autoFocus />
            </Form.Item>

            {/* isActive Switch */}
            <Form.Item label="Active Status" name="isActive" valuePropName="checked">
                <Switch defaultChecked />
            </Form.Item>

            <button type="submit" className={Styles.btnCreate} loading={loading} >
                Save
            </button>
            <button onClick={onClose} className={Styles.btnCancel}>
                Cancel
            </button>
        </Form>
    );
};

export default CreateCategory;
