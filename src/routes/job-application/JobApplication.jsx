import { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Table, Space, Input, Button, Select, message, Form, Tooltip, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { Styles } from "../../components/utils/CustomStyle";
import {
    SearchOutlined,
    FormOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import CenterSlideModalLg from "../../components/modals/ModalCenterLg";
import SweetAlertDelete from "../../components/utils/SweetAlertDelete";
import jwt_decode from 'jwt-decode';
import CreateJobApplication from './CreateJobApplication';
import UpdateJobApplication from './UpdateJobApplication';
import { deleteJobApplicationApi, getJobApplicationApi, updateJobApplicationStatusApi, createJobApplicationApi } from '../../components/apis/JobApplicationApi';
import { applicationStatuses, NEW_QUICK, NEW_USER, PAGINATION_SPACE, PAGINATION_TITLE } from '../../components/utils/Constants';
import dayjs from "dayjs";
import { getSkillApi } from '../../components/apis/SkillApi';

const JobApplication = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [activeForm, setActiveForm] = useState(null);
    const [updateUserId, setUpdateUserId] = useState(null);
    const [permissions, setPermissions] = useState({});
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState(10);
    const [quickForm] = Form.useForm();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormVisible, setFormVisible] = useState(false);

    const handleShowSizeChange = (current, size) => {
        setPageSize(size);
    };

    const toggleFormVisibility = () => {
        setFormVisible((prev) => !prev);
    };

    useEffect(() => {
        document.title = "Job Application";
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
        }, 5000);
        const fetchData = async () => {
            try {
                const response = await getJobApplicationApi();
                const JobData = await getSkillApi();
                const activeJob = JobData.filter((des) => des.isActive);
                setJobs(activeJob);

                if (Array.isArray(response)) {
                    setData(response);
                    setFilteredData(response);
                } else {
                    console.error("Data is not an array:", response);
                    setData([]);
                    setFilteredData([]);
                }

                if (token) {
                    try {
                        const decodedToken = jwt_decode(token);
                        setPermissions(decodedToken.permissions || {});
                    } catch (error) {
                        console.error("Token decoding failed:", error);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const canCreateUser = permissions['/job-application']?.includes('create');
    const canUpdateUser = permissions['/job-application']?.includes('update');
    const canDeleteUser = permissions['/job-application']?.includes('delete');

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            setFilteredData(data);
        } else {
            const filtered = data.filter(
                (user) =>
                    user.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const openRightModal = (form, dataId) => {
        setActiveForm(form);
        if (form === "formUpdate") {
            setUpdateUserId(dataId);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddCreated = async (newUser) => {
        try {
            if (!newUser || !newUser._id) {
                console.error("New user object does not contain _id:", newUser);
                return;
            }
            setData((prevData) => [newUser, ...prevData]);
            setFilteredData((prevData) => [newUser, ...prevData]);

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleUpdate = (updatedData) => {
        const updatedList = data.map((dept) =>
            dept._id === updatedData._id ? { ...dept, ...updatedData } : dept
        );
        const updatedRoleIndex = updatedList.findIndex((dept) => dept._id === updatedData._id);
        if (updatedRoleIndex > -1) {
            const updatedRole = updatedList[updatedRoleIndex];
            updatedList.splice(updatedRoleIndex, 1);
            setData([updatedRole, ...updatedList]);
            setFilteredData([updatedRole, ...updatedList]);
        } else {
            setData(updatedList);
            setFilteredData(updatedList);
        }

        closeModal();
    };

    const handleDelete = SweetAlertDelete(
        deleteJobApplicationApi,
        data,
        setData,
        setFilteredData,
        searchText
    );

    const handleStatusChange = async (newStatus, applicationId) => {
        try {
            await updateJobApplicationStatusApi(applicationId, newStatus);
            const updatedData = data.map((item) =>
                item._id === applicationId ? { ...item, status: newStatus } : item
            );
            setData(updatedData);
            setFilteredData(updatedData);
            message.success('Status updated successfully!');
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleQuickAdd = async (values) => {
        try {
            setLoading(true);
            const response = await createJobApplicationApi(values);
            message.success('Job application created successfully!');
            handleAddCreated(response.data);
            quickForm.resetFields();
        } catch (error) {
            message.error(error.message || "Failed to create job application.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Jobs",
            dataIndex: "skillId",
            key: "skillId",
            render: (text, record) => <span>{record.skillId.name}</span>,
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            render: (text, record) => <span>{text}</span>,
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => <span>{dayjs(text).format("DD-MM-YYYY")}</span>,
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (status, record) => {
                return (
                    <div>
                        <Select
                            defaultValue={status}
                            className="w-[190px]"
                            placeholder="Select a status"
                            showSearch
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(newStatus) => handleStatusChange(newStatus, record._id)}
                        >
                            {applicationStatuses.map((status) => (
                                <Select.Option
                                    key={status.name}
                                    value={status.name}
                                    label={status.name}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: "10px",
                                                height: "10px",
                                                borderRadius: "50%",
                                                backgroundColor: status.color,
                                            }}
                                        />
                                        <span>{status.name}</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                );
            },
        },
        {
            title: (
                <span style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    Action
                </span>
            ),
            key: "action",
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title="Edit" placement="top">
                        <button
                            className={Styles.btnEdit}
                            onClick={() => openRightModal("formUpdate", record._id)}
                            shape="circle"
                            disabled={!canUpdateUser}
                        >
                            <FormOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top">
                        <button
                            className={Styles.btnDelete}
                            onClick={() => handleDelete(record._id)}
                            shape="circle"
                            disabled={!canDeleteUser}
                        >
                            <DeleteOutlined />
                        </button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <Breadcrumb
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>Job Application</span> }]}
                style={{ margin: "16px 0" }}
            />
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: "#fff",
                    borderRadius: "8px",
                }}
            >
                <div className="flex justify-between pb-5">
                    <h2 className={Styles.headTitle}>Job Application</h2>
                    <div className="flex items-center gap-4">
                        <div>
                            <Input
                                placeholder="Search..."
                                suffix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                className={Styles.btnCreate}
                                onClick={() => openRightModal("form")}
                                disabled={!canCreateUser}
                            >
                                {NEW_USER} Job Application
                            </button>
                            <button
                                className={`${Styles.btnQuick} ml-2`}
                                disabled={!canCreateUser}
                                onClick={toggleFormVisibility}
                            >
                                {NEW_QUICK}
                            </button>
                        </div>
                    </div>
                </div>

                {isFormVisible && (
                    < Form form={quickForm} layout="vertical" onFinish={handleQuickAdd} style={{ marginBottom: 20 }}>
                        <div className='shadow-sm'>
                            <div className="bg-blue-custom text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
                                <h2 className="text-md font-semibold">New Quick Form</h2>
                                <button
                                    onClick={toggleFormVisibility}
                                    className="text-white text-2xl cursor-pointer hover:text-gray-200 focus:outline-none"
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
                                <Form.Item
                                    label="Jobs"
                                    name="skillId"
                                    rules={[{ required: true, message: "Please enter jobs" }]}
                                >
                                    <Select
                                        placeholder="Select a job"
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                        style={{ width: '100%' }} // Set width to 100%
                                    >
                                        {jobs.map((cate) => (
                                            <Select.Option key={cate._id} value={cate._id}>
                                                {cate.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Job Location"
                                    name="location"
                                    rules={[{ required: true, message: 'Please enter location' }]}
                                >
                                    <Input placeholder="Job Location" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please enter name' }]}
                                >
                                    <Input placeholder="Applicant Name" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item label=" ">
                                    <button type="submit" className={Styles.btnCreate} disabled={!canCreateUser}>
                                        Add
                                    </button>
                                </Form.Item>
                            </div>
                        </div>

                    </Form>
                )}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        pagination={{
                            position: ["bottomRight"],
                            showTotal: (total, range) => `${range[0]}${PAGINATION_SPACE}${range[1]} of ${total} ${PAGINATION_TITLE}`,
                            pageSizeOptions: ["10", "15", "20", "25", "30", "50"],
                            showSizeChanger: true,
                            onShowSizeChange: handleShowSizeChange,
                            pageSize,
                        }}
                        dataSource={filteredData}
                        rowKey={(record) => record._id || record.username}
                        scroll={{ x: 'max-content' }}
                        loading={loading}
                        components={{
                            body: {
                                cell: (props) => (
                                    <td {...props} style={{ paddingTop: "8px", paddingBottom: "8px" }} />
                                ),
                            },
                        }}
                    />
                )}
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? "Update Job Application" : "Add New Job Application"}>
                    {activeForm === "form" && <CreateJobApplication onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateJobApplication userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout >
    );
};

export default JobApplication;