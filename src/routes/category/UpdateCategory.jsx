import React, { useState, useEffect } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import { updateCategoryApi, viewCategoryApi } from "../../components/apis/CategoryApi";
import { Styles } from "../../components/utils/CustomStyle";

const UpdateCategory = ({ userId, onUserUpdated, onClose }) => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [loading, setLoading] = useState(false);

    // Populate form with existing values when editing
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await viewCategoryApi(userId);
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
            const response = await updateCategoryApi(userId, formData);
            message.success("Category updated successfully!");
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to update Category.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
                <Switch />
            </Form.Item>

            {/* Submit and Cancel Buttons */}
            <button type="submit" className={Styles.btnUpdate} loading={loading}>
                Update
            </button>
            <button onClick={onClose} className={Styles.btnCancel} style={{ marginLeft: 10 }}>
                Cancel
            </button>
        </Form>
    );
};

export default UpdateCategory;
