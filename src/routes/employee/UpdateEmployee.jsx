import React, { useState, useEffect } from 'react';
import { message, Form, Input, Button, DatePicker, Select, Upload, InputNumber, Image, Switch } from 'antd';
import { DollarCircleFilled, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getRoleApi } from '../../components/apis/RoleApi';
import { uploadImage } from '../../components/apis/UploadImageApi';
import { checkIdExistsApi, getEmployeeByIdApi, updateEmployeeApi } from '../../components/apis/EmployeeApi';
import { businessAddresses, employeeTypes, Gender, maritalStatuses, Salutation, SAVE_ICON } from '../../components/utils/Constants';
import { CloudUpload } from 'lucide-react';
import { getDesignationApi } from '../../components/apis/DesignationApi';
import { getDepartmentApi } from '../../components/apis/DepartmentApi';
import { Styles } from '../../components/utils/CustomStyle';
import { translate } from '../../components/utils/Translations';

const UpdateEmployee = ({ userId, onUserUpdated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [designation, setDesignation] = useState([]);
    const [department, setDepartment] = useState([]);
    const [roles, setRoles] = useState([]);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [idError, setIdError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userRes, designationRes, departmentRes, roleRes] = await Promise.all([
                    getEmployeeByIdApi(userId),
                    getDesignationApi(),
                    getDepartmentApi(),
                    getRoleApi(),
                ]);
                const user = userRes.data;
                setDesignation(designationRes.filter(des => des.isActive));
                setDepartment(departmentRes.filter(dep => dep.isActive));
                setRoles(roleRes.data);

                // Remove password before setting form values
                const { password, ...userWithoutPassword } = user;

                form.setFieldsValue({ ...userWithoutPassword, dob: moment(user.dob) });
                setImageUrl(uploadImage(user.imgUrl));
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
            formData.append('salutation', values.salutation);
            formData.append('name', values.name);
            formData.append('designation', values.designation);
            formData.append('department', values.department);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('gender', values.gender);
            formData.append('dob', values.dob.format('YYYY-MM-DD'));
            formData.append('city', values.city);
            formData.append('language', values.language);
            formData.append('role', values.role);
            formData.append('address', values.address);
            formData.append('about', values.about);
            formData.append('skill', values.skill);
            formData.append('rate', values.rate);
            formData.append('employeeType', values.employeeType);
            formData.append('maritalStatus', values.maritalStatus);
            formData.append('businessAddress', values.businessAddress);
            formData.append('isActive', values.isActive);

            if (values.password) {
                formData.append('password', values.password);
            }

            if (image) {
                formData.append('profileImage', image); // Append file if selected
            }
            const response = await updateEmployeeApi(userId, formData);
            message.success('User updated successfully!');
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error('Failed to update user');
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const disabledDate = (current) => {
        return current && current.isAfter(moment().subtract(18, 'years'), 'day');
    };

    const handleImageUpload = (file) => {
        setImage(file); // Store file object for upload
        setImageUrl(URL.createObjectURL(file)); // Create a preview URL for the image
        return false; // Prevent automatic upload
    };

    const handleIdChange = async (e) => {
        const id = e.target.value;
        if (id) {
            try {
                const response = await checkIdExistsApi(id);
                if (response.exists) {
                    setIdError('This employee id already exists');
                } else {
                    setIdError('');
                }
            } catch (error) {
                setIdError('Error checking employee id');
                console.error('Error:', error);
            }
        } else {
            setIdError('');
        }
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_0.3fr] gap-4">
                {/* Left Side - Form Fields */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                            name="employeeId"
                            label="Employee ID"
                            rules={[{ required: true, message: 'Employee ID is required' }]}
                            help={idError}
                            validateStatus={idError ? 'error' : ''}
                        >
                            <Input onChange={handleIdChange} placeholder="Enter Employee ID" />
                        </Form.Item>

                        <Form.Item
                            name="salutation"
                            label="Salutation"
                            rules={[{ required: true, message: 'Salutation is required' }]}
                        >
                            <Select placeholder="Select Salutation">
                                {Salutation.map(status => (
                                    <Select.Option key={status.name} value={status.name}>
                                        {status.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="Employee Name"
                            rules={[{ required: true, message: 'Employee name is required' }]}
                        >
                            <Input placeholder="Enter Employee Name" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                            name="language"
                            label="Language"
                            rules={[{ required: true, message: 'Language is required' }]}
                        >
                            <Input placeholder="Enter Language" />
                        </Form.Item>


                        <Form.Item
                            name="designation"
                            label="Designation"
                            rules={[{ required: true, message: 'Designation is required' }]}
                        >
                            <Select placeholder="Select a designation">
                                {designation.map(role => (
                                    <Select.Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: 'Department is required' }]}
                        >
                            <Select placeholder="Select a department">
                                {department.map(role => (
                                    <Select.Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                {/* Right Side - Image Upload */}
                <div>
                    <label className="text-sm font-medium text-gray-700">Profile Image</label>
                    <Upload
                        showUploadList={false}
                        beforeUpload={handleImageUpload}
                    >
                        <div className="border mt-2 border-dashed bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer hover:border-blue-500">
                            {imageUrl ? (
                                <Image width={200} height={100} className='object-cover' src={imageUrl} alt="Uploaded Preview" />
                            ) : (
                                <div className="object-cover w-[200px] h-[100px] rounded-md flex justify-center items-center">
                                    <div className='flex flex-col items-center'>
                                        <CloudUpload className="text-gray-400" size={50} />
                                        <p>Choose a file</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Upload>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: 'City is required' }]}
                >
                    <Input placeholder="Enter City" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Mobile"
                    rules={[{ required: true, message: 'Mobile is required' }]}
                >
                    <Input placeholder="Enter Mobile Number" />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Gender is required' }]}
                >
                    <Select placeholder="Select Gender">
                        {Gender.map(gender => (
                            <Select.Option key={gender.name} value={gender.name}>
                                {gender.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="dob"
                    label="Date of Birth (18 years up)"
                    rules={[{ required: true, message: 'Date of Birth is required' }]}
                >
                    <DatePicker
                        className="w-full"
                        placeholder="Select DOB"
                        disabledDate={disabledDate}
                        format="YYYY-MM-DD"
                    />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* email */}
                <Form.Item
                    name="email"
                    label="Employee Email"
                    rules={[{ required: true, message: 'Employee email is required' }]}
                >
                    <Input placeholder="example@gmail.com" />
                </Form.Item>
                <Form.Item name="password" label="New Password">
                    <Input.Password placeholder="Enter new password (leave empty to keep current)" />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const passwordValue = getFieldValue('password');
                                if (passwordValue && !value) {
                                    return Promise.reject(new Error('Confirm Password is required'));
                                }
                                if (passwordValue && passwordValue !== value) {
                                    return Promise.reject(new Error('Passwords do not match!'));
                                }
                                return Promise.resolve();
                            }
                        })
                    ]}
                >
                    <Input.Password placeholder="Confirm new password" />
                </Form.Item>

            </div>

            <div className="w-full">
                <Form.Item
                    name="address"
                    label="Address"
                >
                    <Input.TextArea placeholder="Enter Address" />
                </Form.Item>
            </div>

            <div className="w-full">
                <Form.Item
                    name="about"
                    label="About"
                >
                    <Input.TextArea rows={5} placeholder="Enter About" />
                </Form.Item>
            </div>

            <div className="border-t border-gray-200 pt-3">
                <h3 className='text-lg font-semibold mb-8'>Other Details</h3>
            </div>

            <div className="w-full">
                <Form.Item
                    name="skill"
                    label="Skill"
                >
                    <Input.TextArea placeholder="Enter Skill" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item
                    name="rate"
                    label="Monthly Rate"
                    rules={[{ required: true, message: 'Enter Rate' }]}
                >
                    <InputNumber
                        min={1}
                        addonAfter={<DollarCircleFilled />}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="employeeType"
                    label="Employee Type"
                >
                    <Select placeholder="Select Employee Type">
                        {employeeTypes.map(status => (
                            <Select.Option key={status.name} value={status.name}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="maritalStatus"
                    label="Marital Status"
                >
                    <Select placeholder="Select Marital Status">
                        {maritalStatuses.map(status => (
                            <Select.Option key={status.name} value={status.name}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="businessAddress"
                    label="Business Address"
                >
                    <Select placeholder="Select Business Address">
                        {businessAddresses.map(status => (
                            <Select.Option key={status.name} value={status.name}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <Form.Item label="Login Allowed?" name="isActive" valuePropName="checked">
                <Switch />
            </Form.Item>

            {/* Form Buttons */}
            <button className={Styles.btnUpdate} type="submit" loading={loading} >
                {SAVE_ICON}{translate('edit')}
            </button>
            <button onClick={onClose} className={Styles.btnCancel} >
                {translate('cancel')}
            </button>
        </Form>
    );
};

export default UpdateEmployee;
