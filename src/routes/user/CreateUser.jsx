import React, { useEffect, useState } from 'react';
import moment from 'moment'; // Import moment
import { message, Form, Input, Button, Upload, Image, DatePicker, Select, Switch } from 'antd'; // Added Select here
import InputMask from 'react-input-mask';
import { CloudUpload } from 'lucide-react';
import { checkUsernameExistsApi, createQueryApi } from '../../components/apis/UserApi';
import { getRoleApi } from '../../components/apis/RoleApi';
import { Styles } from "../../components/utils/CustomStyle";
import { getEmployeeApi } from '../../components/apis/EmployeeApi';
import { SAVE_ICON } from '../../components/utils/Constants';
import { translate } from '../../components/utils/translations';


const CreateUser = ({ onUserCreated, onClose }) => { // Assuming roles are passed as props
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [usernameError, setUsernameError] = useState('');


    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoleApi();
                setRoles(response.data);
                const empData = await getEmployeeApi();
                setEmployees(empData);
            } catch (error) {
                message.error('Failed to fetch roles');
                console.error('Error:', error);
            }
        };
        fetchRoles();
    }, []);


    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        values.isActive = values.isActive ?? true;
        // Append form values to FormData
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Append image file if uploaded
        if (imageFile) {
            formData.append('profileImage', imageFile); // Ensure this matches the multer setup
        }

        try {
            const response = await createQueryApi(formData);
            message.success('User created successfully!');
            onUserCreated(response.data);
            form.resetFields();
            setImageUrl(null);
            setImageFile(null);
        } catch (error) {
            if (error.response) {
                console.error('Response error data:', error.response.data);
                message.error(`Error: ${error.response.data.message || 'Failed to create user.'}`);
            } else {
                console.error('Error:', error);
                message.error('Failed to create user. Please check required fields.');
            }
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
            <div className="grid grid-cols-1 md:grid-cols-[1fr_0.3fr] gap-4">
                {/* Left Side - Form Fields */}
                <div>


                </div>

                {/* Right Side - Image Upload */}

            </div>


            <Form.Item name="username" label={translate('username')}
                rules={[{ required: true, message: translate('username') + translate('required') }]}
                help={usernameError}
                validateStatus={usernameError ? 'error' : ''}
            >
                <Input onChange={handleUsernameChange} placeholder={`${translate('enter')} ${translate('username')}`} />
            </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="employeeId" label={translate('employee')} rules={[{ required: true, message: translate('selectA') + translate('employee') }]}>
                    <Select placeholder={translate('selectA') + translate('employee')}>
                        {employees.map((role) => (
                            <Select.Option key={role._id} value={role._id}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="role" label={translate('role')} rules={[{ required: true, message: translate('role') + translate('required') }]}>
                    <Select placeholder={translate('selectA') + translate('role')}>
                        {roles.map((role) => (
                            <Select.Option key={role._id} value={role._id}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="password" label={translate('pass')}>
                    <Input.Password placeholder={`${translate('enter')}${translate('pass')}${translate('new')}`} />
                </Form.Item>
                <Form.Item name="confirm" label={translate('confirmPass')} dependencies={['password']} rules={[{
                    required: true,
                    message: `${translate('confirm')}${translate('new')}${translate('pass')}${translate('required')}`,
                    validator: (_, value) => {
                        const passwordValue = form.getFieldValue('password');
                        if (passwordValue && !value) return Promise.reject(new Error('Confirm Password is required'));
                        if (passwordValue && passwordValue !== value) return Promise.reject(new Error('Passwords do not match!'));
                        return Promise.resolve();
                    }
                }]}>
                    <Input.Password placeholder={`${translate('confirmPass')}`} />
                </Form.Item>
            </div>
            <Form.Item label={translate('activeStatus')} name="isActive" valuePropName="checked" initialValue={true}>
                <Switch />
            </Form.Item>


            {/* Form Buttons */}
            <button type="submit" className={Styles.btnCreate} loading={loading}>
                {SAVE_ICON} {translate('save')}
            </button>
            <button onClick={onClose} className={Styles.btnCancel}>
                {translate('cancel')}
            </button>
        </Form>
    );
};

export default CreateUser;
