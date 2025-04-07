import React, { useEffect, useState } from 'react';
import { message, Form, Input, Button, Checkbox } from 'antd';
import { getActionApi } from '../../components/apis/ActionApi';
import { updateRoleApi, getRoleByIdApi, checkRoleNameExistsApi } from '../../components/apis/RoleApi';

const UpdateRole = ({ roleId, onUpdate, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [roleNameError, setRoleNameError] = useState('');

    // Fetch available roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const responseRoles = await getActionApi();
                setRoles(responseRoles.data);
            } catch (error) {
                message.error('Failed to fetch roles');
                console.error('Error:', error);
            }
        };

        fetchRoles();
    }, []);

    // Fetch role data by ID and set initial form values
    useEffect(() => {
        const fetchRoleData = async () => {
            if (roleId) {
                try {
                    const roleData = await getRoleByIdApi(roleId);
                    console.log('Fetched role data:', roleData);

                    // Set the initial values for the form
                    form.setFieldsValue({
                        name: roleData.name,
                    });

                    // Set the permissions for checkboxes
                    roles.forEach(role => {
                        const matchedActions = roleData.permissions[role.name] || [];
                        form.setFieldsValue({
                            [`actions-${role.name}`]: matchedActions,
                        });
                    });

                } catch (error) {
                    message.error('Failed to fetch role data');
                    console.error('Error:', error);
                }
            }
        };

        fetchRoleData();
    }, [roleId, roles, form]);

    const handleRoleNameChange = async (e) => {
        const roleName = e.target.value;
        if (roleName && (!form.getFieldValue('name') || roleName !== form.getFieldValue('name'))) {
            try {
                const response = await checkRoleNameExistsApi(roleName);
                if (response.exists) {
                    setRoleNameError('This role name already exists');
                } else {
                    setRoleNameError('');
                }
            } catch (error) {
                setRoleNameError('Error checking role name');
                console.error('Error:', error);
            }
        } else {
            setRoleNameError('');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const permissions = {};
            roles.forEach((role) => {
                const selectedActions = values[`actions-${role.name}`] || [];
                permissions[role.name] = selectedActions.filter(action =>
                    role.action.includes(action)
                );
            });

            const formattedValues = {
                id: roleId,  // Ensure this is a valid ObjectId string
                name: values.name,
                permissions: permissions,
            };

            console.log('Formatted values before API call:', formattedValues);
            const response = await updateRoleApi(formattedValues);
            message.success('Role updated successfully!');
            onUpdate(response.role);

            console.log('Response:', response);
        } catch (error) {
            message.error('Failed to update role');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
                name="name"
                label="Role"
                rules={[{ required: true, message: 'Role name is required' }]}
                help={roleNameError}
                validateStatus={roleNameError ? 'error' : ''}
            >
                <Input
                    type="text"
                    placeholder="Enter role name"
                    onChange={handleRoleNameChange}
                />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.length > 0 && roles.map((role, index) => (
                    <div key={index}>
                        <h3 className='text-lg font-semibold capitalize'>{role.name.replace('/', '')}</h3>
                        <Form.Item
                            name={`actions-${role.name}`}
                        >
                            <Checkbox.Group
                                onChange={(checkedValues) => {
                                    form.setFieldsValue({ [`actions-${role.name}`]: checkedValues });
                                }}
                                value={form.getFieldValue(`actions-${role.name}`) || []}
                            >
                                {role.action.map((action, i) => (
                                    <Checkbox key={i} value={action}>
                                        {action}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                ))}
            </div>

            <Button type="primary" htmlType="submit" loading={loading} disabled={roleNameError}>
                Update
            </Button>
            <Button onClick={onClose} className="ml-3">
                Cancel
            </Button>
        </Form>
    );
};

export default UpdateRole;
