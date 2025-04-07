import React, { useEffect, useState } from 'react';
import { Breadcrumb, Dropdown, Image, Layout, Menu, Modal, Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { viewEmployeeByIdApi } from '../../components/apis/EmployeeApi';
import { uploadImage } from '../../components/apis/UploadImageApi';
import { Ellipsis } from 'lucide-react';
import CenterSlideModalLg from '../../components/modals/ModalCenterLg';
import UpdateEmployee from './UpdateEmployee';
import moment from 'moment';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import Header from './Header';

// Register the necessary components for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const ViewEmployee = () => {
    document.title = "View Employee";
    const navigate = useNavigate();
    const { id } = useParams();
    const [employee, setEmployee] = useState({});  // Change initial state to an object
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateUserId, setUpdateUserId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await viewEmployeeByIdApi(id);
                setEmployee(response.data);  // Assuming response.data contains employee info


            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };
        fetchData();
    }, [id]);

    const openRightModal = (dataId) => {
        setUpdateUserId(dataId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleUpdate = () => {

    }
    const menuDropdown = (
        <div style={{ width: '150px' }}> {/* Set fixed width */}
            <Menu>
                <Menu.Item onClick={() => openRightModal(employee._id)} key="edit">Edit</Menu.Item>
            </Menu>
        </div>
    );

    const dataChart = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                label: 'Task',
                data: [12, 19, 9],
                backgroundColor: ['red', 'blue', 'yellow'],
                // borderColor: ['darkred', 'darkblue', 'darkyellow'],
                borderWidth: 1,
            },
        ],
    };
    const chartOptions = {
        plugins: {
            legend: {
                display: isModalVisible,  // Show legend only when in full-screen mode
            },
        },
        responsive: true,
        // maintainAspectRatio: false,  // Maintains aspect ratio when resized
    };
    // Open the modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Close the modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout>
            <Breadcrumb
                items={[
                    { title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> },
                    { title: <span onClick={() => navigate("/employees")} style={{ cursor: "pointer", color: "#000" }}>Employees</span> },
                    { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>View</span> }
                ]}
                style={{ margin: "16px 0" }}
            />
            <Content
                style={{
                    // padding: 24,
                    margin: 0,
                    minHeight: 280,
                    borderRadius: "8px",
                    // paddingRight: "15px"
                }}
            >

                <div className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-4">
                    <div className="bg-white shadow rounded col-span-2">
                        <Header employee={employee} />
                    </div>
                    <div className="flex rounded p-5 shadow bg-white">
                        {/* Left Side - Image */}
                        <div className="w-[120px] flex-shrink-0">
                            <Image
                                className="object-cover"
                                width={120}
                                height={150}
                                src={uploadImage(employee.imgUrl) || "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"}
                                alt="Employee Image"
                            />
                        </div>


                        {/* Right Side - Full Width (Minus 120px) */}
                        <div className="pl-3 flex-1 ">
                            <h3 className="text-lg font-semibold flex justify-between">
                                {employee.name || 'N/A'}
                                <Dropdown overlay={menuDropdown} trigger={['click']} placement="bottomRight">
                                    <span className="cursor-pointer p-1 hover:bg-gray-200 rounded">
                                        <Ellipsis />
                                    </span>
                                </Dropdown>
                            </h3>
                            <p>{employee.designation?.name} • {employee.department?.name} | User Role: {employee.role?.name || 'N/A'}</p>
                            <hr className='border-gray-300 mt-3' />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <p>Open Tasks</p>
                                    <h4 className="font-semibold">
                                        3
                                    </h4>
                                </div>
                                <div>
                                    <p>Open Tasks</p>
                                    <h4 className="font-semibold">
                                        3
                                    </h4>
                                </div>
                                <div>
                                    <p>Open Tasks</p>
                                    <h4 className="font-semibold">
                                        3
                                    </h4>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className=' rounded p-5 shadow bg-white'>
                        <h4>About</h4>
                        <p>{employee.about || 'No information available'}</p>
                    </div>

                    <div className='rounded p-5 shadow bg-white'>
                        <h4 className='text-xl font-semibold pb-3'>About</h4>
                        <p>{employee.about || 'No information available'}</p>
                    </div>
                    <div className='rounded p-5 shadow bg-white'>
                        <div className="flex justify-between">
                            <h4 className='text-xl font-semibold pb-3'>Tanks</h4>
                            <Button onClick={showModal} icon={<FullscreenOutlined />} type="primary" size="small" style={{ marginTop: 20 }}>
                            </Button>
                        </div>
                        <div >
                            <Pie data={dataChart} options={chartOptions} />
                        </div>

                        {/* Modal Button to show chart in full-screen */}


                        {/* Modal for full-screen view */}
                        <Modal
                            // title="Full-Screen Pie Chart"
                            visible={isModalVisible}
                            onCancel={handleCancel}
                            footer={null}
                            width="80%"  // You can adjust width
                            style={{ top: 20 }}
                            bodyStyle={{ padding: 0 }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',  // Horizontally center the content
                                alignItems: 'center',
                                width: '100%',
                                height: '400px'
                            }}>
                                <Pie data={dataChart} />
                            </div>
                        </Modal>
                    </div>
                    <div className='rounded p-5 shadow bg-white'>
                        <h4 className='text-xl font-semibold pb-3'>Profile Info</h4>
                        <table>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Employee ID</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.employeeId}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Full Name</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.name}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Designation</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.designation?.name}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Department</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.department?.name}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Gender</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.gender}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3 pr-2'>Work Anniversary</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>--</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Date of Birth</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>  {employee.dob ? moment(employee.dob).format('MMMM Do, YYYY') : '--'}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Email</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.email}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Mobile</td>
                                <td >{employee.phone}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Hourly Rate</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>${employee.rate}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Address</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>${employee.address}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Language</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>${employee.language}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Marital Status</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.maritalStatus}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Business Address</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.businessAddress}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Employment Type</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>{employee.employeeType}</td>
                            </tr>
                            <tr>
                                <td className='text-base text-gray-400 font-normal pb-3'>Joining Date</td>
                                <td className='text-base text-gray-600 font-normal pb-3'>  {employee.dob ? moment(employee.joinDate).format('MMMM Do, YYYY') : '--'}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={"Update Employee"}>

                    {updateUserId && (
                        <UpdateEmployee userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout>
    );
};

export default ViewEmployee;
