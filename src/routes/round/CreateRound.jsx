import React, { useState } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import { createRoundApi } from "../../components/apis/RoundApi";
import { Styles } from "../../components/utils/CustomStyle";

const CreateRound = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createRoundApi(formData);
            message.success('Round created successfully!');
            onUserCreated(response.data);
        } catch (error) {
            message.error(error.message || "Failed to create round.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            {/* Name Input */}
            <Form.Item
                label="Round Name"
                name="name"
                rules={[{ required: true, message: "Please enter round name" }]}
            >
                <Input placeholder="Enter round name" autoFocus />
            </Form.Item>

            {/* isActive Switch */}
            <Form.Item label="Active Status" name="isActive" valuePropName="checked">
                <Switch defaultChecked />
            </Form.Item>

            <button type="submit" className={Styles.btnCreate} loading={loading} >
                Save
            </button>
            <button onClick={onClose} className={Styles.btnCancel} >
                Cancel
            </button>
        </Form>
    );
};

export default CreateRound;
