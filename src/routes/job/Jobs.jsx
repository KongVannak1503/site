import { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Table, Space, Input, Select, message, Form, Tooltip, Spin, Avatar } from "antd";
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
import { applicationStatuses, NEW_QUICK, NEW_USER, openStatuses, PAGINATION_SPACE, PAGINATION_TITLE } from '../../components/utils/Constants';
import dayjs from "dayjs";
import { getSkillApi } from '../../components/apis/SkillApi';
import UpdateJob from './UpdateJob';
import CreateJob from './CreateJob';
import { deleteJobApi, getJobApi, updateJobStatusApi } from '../../components/apis/JobApi';
import { uploadImage } from '../../components/apis/UploadImageApi';

const Jobs = () => {
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
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleShowSizeChange = (current, size) => {
        setPageSize(size);
    };

    useEffect(() => {
        document.title = "Jobs";
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
        }, 5000);
        const fetchData = async () => {
            try {
                const response = await getJobApi();
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

    const canCreateUser = permissions['/jobs']?.includes('create');
    const canUpdateUser = permissions['/jobs']?.includes('update');
    const canDeleteUser = permissions['/jobs']?.includes('delete');

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
        deleteJobApi,
        data,
        setData,
        setFilteredData,
        searchText
    );

    const handleStatusChange = async (newStatus, applicationId) => {
        try {
            await updateJobStatusApi(applicationId, newStatus);
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

    const columns = [
        {
            title: "Job Title",
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Recruiter",
            dataIndex: "employeeId",
            key: "employeeId",
            render: (text, record) => (
                <Space>
                    {/* Assuming record.employeeId contains the employee details object */}
                    <Avatar src={uploadImage(record.employeeId?.imgUrl)} alt={record.employeeId?.name} />
                    <div>
                        <span>{record.employeeId?.name}</span> {/* Displaying the employee name */}
                        <p className="text-sm text-gray-500">{record.employeeId?.designation?.name}</p> {/* Displaying the designation */}
                    </div>
                </Space>
            ),
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (text) => <span>{dayjs(text).format("DD-MM-YYYY")}</span>,
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
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
                            {openStatuses.map((status) => (
                                <Select.Option
                                    key={status.name}
                                    value={status.value}
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
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>Jobs</span> }]}
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
                                {NEW_USER} Job
                            </button>

                        </div>
                    </div>
                </div>

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
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? "Edit Job" : "Add New Job"}>
                    {activeForm === "form" && <CreateJob onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateJob userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout >
    );
};

export default Jobs;