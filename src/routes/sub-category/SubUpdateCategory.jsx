import React, { useState, useEffect } from "react";
import { Form, Input, Switch, Button, message, Select } from "antd";
import { getCategoryApi } from "../../components/apis/CategoryApi";
import { updateSubCategoryApi, viewSubCategoryApi } from "../../components/apis/SubCategoryApi";
import { Styles } from "../../components/utils/CustomStyle";

const SubUpdateCategory = ({ userId, onUserUpdated, onClose }) => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);

    // Populate form with existing values when editing
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await viewSubCategoryApi(userId);
                const data = response.data;
                form.setFieldsValue({
                    name: data.name,
                    isActive: data.isActive,
                });
                const cateData = await getCategoryApi();
                const activeCategory = cateData.filter(des => des.isActive);
                setCategory(activeCategory);

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
            const response = await updateSubCategoryApi(userId, formData);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    label="Job Category"
                    name="categoryId"
                    rules={[{ required: true, message: "Please enter Category name" }]}
                >
                    <Select placeholder="Select a department">
                        {category.map((role) => (
                            <Select.Option key={role._id} value={role._id}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Sub Category Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter Category name" }]}
                >
                    <Input placeholder="Enter Category name" autoFocus />
                </Form.Item>
            </div>

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

export default SubUpdateCategory;
