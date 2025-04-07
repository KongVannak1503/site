import React, { useState } from "react";
import { Form, Input, Switch, Button, message, DatePicker } from "antd";
import { Styles } from "../../components/utils/CustomStyle";
import ReactQuill from "react-quill";
import { createJobPositionApi } from "../../components/apis/JobPositionApi";

const CreateJobPosition = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");
    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createJobPositionApi(formData);
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

            <button className={Styles.btnCreate} type="submit" loading={loading} >
                Save
            </button>
            <Button onClick={onClose} className="ml-3">
                Cancel
            </Button>
        </Form >
    );
};

export default CreateJobPosition;
