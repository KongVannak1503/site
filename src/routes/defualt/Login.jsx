import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, notification, Spin, Checkbox } from 'antd';
import { uploadImage } from '../../components/apis/UploadImageApi';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);

        const loginData = {
            username: values.username,
            password: values.password,
        };

        try {
            const response = await axios.post('http://localhost:7001/api/auth/login', loginData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            localStorage.setItem('token', `${response.data.token}`);
            window.location.href = '/dashboard'; // Navigate to the dashboard page
        } catch (err) {
            console.error('Login error:', err);
            notification.error({
                message: 'Login failed',
                description: 'Please check your credentials and try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section className="flex items-center justify-center bg-gray-100 h-screen flex-col">
                <div>
                    <img className='h-[100px] mx-auto mb-5' src={uploadImage('uploads/log_usea.png')} alt="" />
                </div>
                <div className="relative max-w-lg px-4 mx-auto sm:px-0">
                    <div className="overflow-hidden mx-auto bg-white rounded-md shadow-md w-[360px]">
                        <div className="px-4 pt-6 sm:px-8 sm:py-7">
                            <div className="text-center">
                                <h2 className="text-md mb-3  text-gray-600">Login to start your session</h2>
                            </div>

                            <Form onFinish={handleSubmit} layout="vertical" className="mt-8">
                                <Form.Item name="username">
                                    <Input
                                        size="large"
                                        required
                                        placeholder="Enter your username"
                                        className="w-full p-4 text-black placeholder-gray-500 bg-white border border-gray-200 rounded-md"
                                        suffix={<UserOutlined />} // Make sure the icon is on the left side (prefix)
                                    />
                                </Form.Item>

                                <Form.Item

                                    name="password"
                                >
                                    <Input.Password
                                        size="large"
                                        required
                                        placeholder="Enter your password"
                                        className="w-full p-4 text-black placeholder-gray-500 bg-white border border-gray-200 rounded-md"
                                    />
                                </Form.Item>
                                <div className="flex flex-col"> {/* Flex container to align checkbox and button */}
                                    <Form.Item name="rememberMe" valuePropName="checked">
                                        <Checkbox className="text-sm">
                                            Remember me
                                        </Checkbox>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            size="large"
                                            type="primary"
                                            htmlType="submit"
                                            block
                                            loading={loading}
                                            className="text-white font-bold bg-blue-600 border border-transparent rounded-md"
                                        >
                                            {loading ? 'Logging in...' : 'Log in'}
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
