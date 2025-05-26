import React, { useEffect, useState } from "react";
import { Form, Input, Switch, message, Select } from "antd";
import { createSubCategoryApi } from "../../../components/apis/SubCategoryApi";
import { Styles } from "../../../components/utils/CustomStyle";
import { getCategoryApi } from "../../../components/apis/CategoryApi";

const SubCreateCategory = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                // designation
                const cateData = await getCategoryApi();
                const activeCategory = cateData.filter(des => des.isActive);
                setCategory(activeCategory);

            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchRoles();
    }, []);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createSubCategoryApi(formData);
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

export default SubCreateCategory;
