import React, { useEffect, useState } from 'react';
import { message, Form, Input, Button, Checkbox } from 'antd';
import { getActionApi } from '../../../components/apis/ActionApi';
import { createRoleApi } from '../../../components/apis/RoleApi';
import { checkRoleNameExistsApi } from '../../../components/apis/RoleApi'; // Import the function to check if the role name exists

const CreateRole = ({ onAddCreated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [roleNameError, setRoleNameError] = useState(''); // To store the error message for duplicate role names

    // Fetch roles from the API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const responseRoles = await getActionApi();
                setRoles(responseRoles.data); // Assuming `data` contains role details
            } catch (error) {
                message.error('Failed to fetch roles');
                console.error('Error:', error);
            }
        };

        fetchRoles();
    }, []);

    const handleRoleNameChange = async (e) => {
        const roleName = e.target.value;
        if (roleName) {
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

            // Iterate through the fetched roles and gather selected permissions
            roles.forEach((role) => {
                const selectedActions = values[`actions-${role.name}`]; // Get selected actions for each role

                // Ensure there are selected actions for the role
                if (selectedActions && selectedActions.length > 0) {
                    permissions[role.name] = selectedActions;  // Store selected actions by route name
                }
            });

            const formattedValues = {
                name: values.name,  // The role name
                permissions: permissions,  // The permissions object
            };

            // Send formatted data to the API to create the role
            const response = await createRoleApi(formattedValues);
            message.success('Role created successfully!');
            onAddCreated(response.role);

            console.log('Response:', response);
        } catch (error) {
            message.error('Failed to create role');
            console.error('Error:', error);
        }
        setLoading(false);
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
                name="name"
                label="Role"
                rules={[{ required: true, message: 'Role name is required' }]}
                help={roleNameError}  // Show error message if role name already exists
                validateStatus={roleNameError ? 'error' : ''}  // Show error style
            >
                <Input
                    type="text"
                    placeholder="Enter role name"
                    onChange={handleRoleNameChange}  // Call the function on key press
                />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.length > 0 && roles.map((role, index) => (
                    <div key={index}>
                        <h3 className='text-lg font-semibold capitalize'>{role.name.replace('/', '')}</h3>
                        <Form.Item
                            name={`actions-${role.name}`} // Form name binding
                            label="Actions">
                            <Checkbox.Group>
                                {role.action.map((action, i) => (
                                    <Checkbox key={i} value={action}>{action}</Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                ))}
            </div>

            <Button type="primary" htmlType="submit" loading={loading} disabled={roleNameError}>
                Save
            </Button>
            <Button onClick={onClose} className="ml-3">
                Cancel
            </Button>
        </Form>
    );
};

export default CreateRole;
