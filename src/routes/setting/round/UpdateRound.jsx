import React, { useState, useEffect } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import { updateRoundApi, viewRoundApi } from "../../../components/apis/RoundApi";
import { Styles } from "../../../components/utils/CustomStyle";

const UpdateRound = ({ userId, onUserUpdated, onClose }) => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [loading, setLoading] = useState(false);

    // Populate form with existing values when editing
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await viewRoundApi(userId);
                const data = response.data;
                console.log(response)
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
            const response = await updateRoundApi(userId, formData);
            message.success("Rounded updated successfully!");
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to update rounded.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Name Input */}
            <Form.Item
                label="Rounded Name"
                name="name"
                rules={[{ required: true, message: "Please enter rounded name" }]}
            >
                <Input placeholder="Enter rounded name" autoFocus />
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

export default UpdateRound;
