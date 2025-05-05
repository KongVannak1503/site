import React, { useEffect, useState } from 'react';
import moment from 'moment'; // Import moment
import { message, Form, Input, Button, Upload, Image, DatePicker, InputNumber, Select } from 'antd';
import { DollarCircleFilled } from '@ant-design/icons';
import { CloudUpload } from 'lucide-react';
import { checkIdExistsApi, createEmployeeApi } from '../../components/apis/EmployeeApi';
import { Option } from 'antd/es/mentions';
import { employeeTypes, maritalStatuses, businessAddresses, Salutation, Gender, SAVE_ICON, constLanguages } from '../../components/utils/Constants'
import { getDepartmentApi } from '../../components/apis/DepartmentApi';
import { getDesignationApi } from '../../components/apis/DesignationApi';
import { getRoleApi } from '../../components/apis/RoleApi';
import { Styles } from '../../components/utils/CustomStyle';
import { translate } from '../../components/utils/Translations';

const CreateEmployee = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [designation, setDesignation] = useState([]);
    const [department, setDepartment] = useState([]);
    const [idError, setIdError] = useState('');
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                // designation
                const design = await getDesignationApi();
                const activeDesRoles = design.filter(des => des.isActive);
                setDesignation(activeDesRoles);
                // department
                const depart = await getDepartmentApi();
                const activeDepartRoles = depart.filter(des => des.isActive);

                const role = await getRoleApi();
                setRoles(role.data);
                setDepartment(activeDepartRoles);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchRoles();
    }, []);
    // Handle Image Preview
    const handleChangeImage = (info) => {
        const file = info.file.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImageUrl(reader.result);
            reader.readAsDataURL(file);
            setImageFile(file);
        }
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

    // Ensure only images are uploaded
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        return isImage;
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();

        // Append form values to FormData
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Append image file if uploaded
        if (imageFile) {
            formData.append('profileImage', imageFile); // Ensure this matches the multer setup
        }

        try {
            const response = await createEmployeeApi(formData);
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

    // Disable future dates for DatePicker
    const disabledDate = (current) => {
        return current && current.isAfter(moment().subtract(18, 'years'), 'day');
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_0.3fr] gap-4">
                {/* Left Side - Form Fields */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                            name="employeeId"
                            label={translate('employeeId')}
                            help={
                                form.getFieldError("employeeId").length === 0 ? idError : null
                            }
                            validateStatus={
                                form.getFieldError("employeeId").length > 0 || idError ? "error" : ""
                            }
                            rules={[{ required: true, message: translate('employeeId') + translate('required') }]}
                        >
                            <Input onChange={handleIdChange} placeholder={translate('enter') + translate('employeeId')} />
                        </Form.Item>

                        <Form.Item
                            name="salutation"
                            label={translate('salutation')}
                            rules={[{ required: true, message: translate('salutation') + translate('required') }]}
                        >
                            <Select placeholder={translate('select') + translate('salutation')}>
                                {Salutation.map(status => (
                                    <Option key={status.name} value={status.name}>
                                        {status.name}
                                    </Option>
                                ))}
                            </Select>

                        </Form.Item>

                        <Form.Item
                            name="name"
                            label={translate('employeeName')}
                            rules={[{ required: true, message: translate('employeeName') + translate('required') }]}
                        >
                            <Input placeholder={translate('enter') + translate('employeeName')} />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                            name="language"
                            label={translate('language')}
                            rules={[{ required: true, message: 'Language is required' }]}
                        >
                            <Select
                                mode="multiple"
                                showSearch
                                style={{ flex: "1 1 auto", minWidth: "0" }} // Prevents breaking
                                optionFilterProp="children"
                                maxTagCount="responsive" // Keeps selected items inline
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {constLanguages.map((role) => (
                                    <Select.Option key={role.name} value={role.name}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>


                        <Form.Item
                            name="designation"
                            label={translate('designation')}
                            rules={[{ required: true, message: 'Designation is required' }]}
                        >
                            <Select placeholder="Select a designation">
                                {designation.map((role) => (
                                    <Select.Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="department"
                            label={translate('department')}
                            rules={[{ required: true, message: 'Department is required' }]}
                        >
                            <Select placeholder="Select a department">
                                {department.map((role) => (
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
                    <label className="text-sm font-medium text-gray-700">{translate('profileImage')}</label>
                    <Upload
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChangeImage}
                    >
                        <div className="border mt-2 border-dashed bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer hover:border-blue-500">
                            {imageUrl ? (
                                <Image width={200} height={100} className='object-cover' src={imageUrl} alt="Uploaded Preview" />
                            ) : (
                                <div className="object-cover w-[200px] h-[100px] rounded-md flex justify-center items-center">
                                    <div className='flex flex-col items-center'>
                                        <CloudUpload className="text-gray-400" size={50} />
                                        <p>{translate('chooseImage')}</p>
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
                    label={translate('city')}
                    rules={[{ required: true, message: 'City is required' }]}
                >
                    <Input placeholder="Enter City" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label={translate('mobile')}
                    rules={[{ required: true, message: 'Mobile is required' }]}
                >
                    <Input placeholder="Enter Mobile Number" />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label={translate('gender')}
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
                    label={translate('dateOfBirth') + ' (' + translate('adultUp') + ')'}
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
                    label={translate('employeeEmail')}
                    rules={[{ required: true, message: 'Employee email is required' }]}
                >
                    <Input placeholder="example@gmail.com" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Role is required' }]} label={translate('newPass')}>
                    <Input.Password placeholder="Enter  password " />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label={translate('confirmPass')}
                    dependencies={['password']}
                    rules={[
                        ({ getFieldValue }) => ({
                            required: true,
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
                    label={translate('address')}
                >
                    <Input.TextArea placeholder="Enter Address" />
                </Form.Item>
            </div>

            <div className="w-full">
                <Form.Item
                    name="about"
                    label={translate('about')}
                >
                    <Input.TextArea placeholder="Enter About" />
                </Form.Item>
            </div>

            <div className="border-t border-gray-200 pt-3">
                <h3 className='text-lg font-semibold mb-8'>{translate('otherDetails')}</h3>
            </div>

            <div className="w-full">
                <Form.Item
                    name="skill"
                    label={translate('skills')}
                >
                    <Input.TextArea placeholder="Enter Skill" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item
                    name="rate"
                    label={translate('monthlyRate')}
                    rules={[{ required: true, message: 'Enter Rate' }]}
                >
                    <InputNumber
                        min={1}
                        addonAfter={<DollarCircleFilled />}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                {/* <Form.Item
                    name="employeeType"
                    label="Employee Type"
                    rules={[{ required: true, message: 'Please select an employee type!' }]}
                >
                    <Select style={{ width: 200, marginBottom: '20px' }}>
                        {employeeTypes.map(status => (
                            <Select.Option key={status.name} value={status.name}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item> */}
                <Form.Item
                    name="employeeType"
                    label={translate('employeeType')}
                >
                    <Select placeholder="Select employee type!">
                        {employeeTypes.map(emp => (
                            <Select.Option key={emp.name} value={emp.name}>
                                {emp.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="maritalStatus"
                    label={translate('maritalStatus')}
                >
                    <Select placeholder="Select Marital Status">
                        {maritalStatuses.map(status => (
                            <Option key={status.name} value={status.name}>
                                {status.name}
                            </Option>
                        ))}
                    </Select>

                </Form.Item>

                <Form.Item
                    name="businessAddress"
                    label={translate('businessAddress')}
                >
                    <Select placeholder="Select Business Address">
                        {businessAddresses.map(status => (
                            <Option key={status.name} value={status.name}>
                                {status.name}
                            </Option>
                        ))}
                    </Select>

                </Form.Item>
            </div>

            {/* Form Buttons */}
            <button className={Styles.btnCreate} type="submit" loading={loading} >
                {SAVE_ICON}{translate('save')}
            </button>
            <button onClick={onClose} className={Styles.btnCancel}>
                {translate('cancel')}
            </button>
        </Form>
    );
};

export default CreateEmployee;
