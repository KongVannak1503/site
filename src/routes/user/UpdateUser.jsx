import React, { useState, useEffect } from 'react';
import { message, Form, Input, Button, DatePicker, Select, Upload, Image, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import InputMask from 'react-input-mask';
import { checkUsernameExistsApi, getQueryByIdApi, updateQueryApi } from '../../components/apis/UserApi';
import { getRoleApi } from '../../components/apis/RoleApi';
import { uploadImage } from '../../components/apis/UploadImageApi';
import { getEmployeeApi } from '../../components/apis/EmployeeApi';
import { Styles } from '../../components/utils/CustomStyle';

const UpdateUser = ({ userId, onUserUpdated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [usernameError, setUsernameError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getQueryByIdApi(userId);
                const user = response.data;
                const responseRoles = await getRoleApi();
                setRoles(responseRoles.data);
                const empData = await getEmployeeApi();
                setEmployees(empData);

                form.setFieldsValue({
                    employeeId: user.employeeId,
                    phone: user.phone,
                    username: user.username,
                    role: user.role ? user.role._id : undefined,
                    isActive: user.isActive,
                });
            } catch (error) {
                message.error('Failed to fetch user data');
                console.error('Error:', error);
            }
        };
        fetchUserData();
    }, [userId, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('employeeId', values.employeeId);
            formData.append('username', values.username);
            formData.append('role', values.role);

            if (values.password) {
                formData.append('password', values.password);
            }



            const response = await updateQueryApi(userId, formData);
            message.success('User updated successfully!');
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error('Failed to update user');
            console.error('Error:', error);
        }
        setLoading(false);
    };
    const handleUsernameChange = async (e) => {
        const username = e.target.value;
        if (username) {
            try {
                const response = await checkUsernameExistsApi(username);
                if (response.exists) {
                    setUsernameError('This username already exists');
                } else {
                    setUsernameError('');
                }
            } catch (error) {
                setUsernameError('Error checking username');
                console.error('Error:', error);
            }
        } else {
            setUsernameError('');
        }
    };
    return (
        <Form form={form} onFinish={onFinish} layout="vertical">

            <Form.Item name="username" label="Username"
                rules={[{ required: true, message: 'Username is required' }]}
                help={usernameError}
                validateStatus={usernameError ? 'error' : ''}
            >
                <Input onChange={handleUsernameChange} placeholder="Enter username" />
            </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: 'Employee is required' }]}>
                    <Select placeholder="Select a employee">
                        {employees.map((role) => (
                            <Select.Option key={role._id} value={role._id}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role is required' }]}>
                    <Select placeholder="Select a role">
                        {roles.map((role) => (
                            <Select.Option key={role._id} value={role._id}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="password" label="Password">
                    <Input.Password placeholder="Enter new password (leave empty to keep current)" />
                </Form.Item>
                <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} rules={[{
                    required: true,
                    message: 'Confirm Password is required',
                    validator: (_, value) => {
                        const passwordValue = form.getFieldValue('password');
                        if (passwordValue && !value) return Promise.reject(new Error('Confirm Password is required'));
                        if (passwordValue && passwordValue !== value) return Promise.reject(new Error('Passwords do not match!'));
                        return Promise.resolve();
                    }
                }]}>
                    <Input.Password placeholder="Confirm new password" />
                </Form.Item>
            </div>
            <Form.Item label="Active Status" name="isActive" valuePropName="checked">
                <Switch />
            </Form.Item>


            <button type="submit" className={Styles.btnUpdate} loading={loading}>Update User</button>
            <button onClick={onClose} className={Styles.btnCancel}>
                Cancel
            </button>
        </Form>
    );
};

export default UpdateUser;
