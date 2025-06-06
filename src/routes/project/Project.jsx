import { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Table, Space, Input, Button, Avatar, Badge, Tooltip } from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { Styles } from "../../components/utils/CustomStyle";
import {
    PlusOutlined,
    SearchOutlined,
    FormOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import CenterSlideModalLg from "../../components/modals/ModalCenterLg";
import SweetAlertDelete from "../../components/utils/SweetAlertDelete";
import jwt_decode from 'jwt-decode';
import { uploadImage } from '../../components/apis/UploadImageApi';
import { deleteProjectApi, getProjectApi } from '../../components/apis/ProjectApi';
import CreateProject from './CreateProject';
import UpdateProject from './UpdateProject';

const Project = () => {
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
    const handleShowSizeChange = (current, size) => {
        setPageSize(size); // Update page size state
    };

    useEffect(() => {
        document.title = "Projects";
        const fetchData = async () => {
            try {
                const response = await getProjectApi();
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
            }
        };
        fetchData();
    }, [token]);

    const canCreateUser = permissions['/projects']?.includes('create');
    const canUpdateUser = permissions['/projects']?.includes('update');
    const canDeleteUser = permissions['/projects']?.includes('delete');

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            setFilteredData(data);
        } else {
            const filtered = data.filter(
                (user) =>
                    user.name.toLowerCase().includes(value.toLowerCase()) ||
                    user.employeeId.toLowerCase().includes(value.toLowerCase()) ||
                    user.email.toLowerCase().includes(value.toLowerCase())
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

    const handleAddCreated = async (newData) => {
        try {
            if (!newData || !newData._id) {
                console.error("New data object does not contain _id:", newData);
                return;
            }
            setData((prevData) => [newData, ...prevData]);
            setFilteredData((prevData) => [newData, ...prevData]);

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding data:", error);
        }
    };

    const handleUpdate = (updatedData) => {
        // Update the data array
        const updatedList = data.map((dept) =>
            dept._id === updatedData._id ? { ...dept, ...updatedData } : dept
        );
        const updatedRoleIndex = updatedList.findIndex((dept) => dept._id === updatedData._id);
        if (updatedRoleIndex > -1) {
            const updatedRole = updatedList[updatedRoleIndex];
            updatedList.splice(updatedRoleIndex, 1); // Remove the updated role from its original position
            setData([updatedRole, ...updatedList]); // Prepend it to the start of the array
            setFilteredData([updatedRole, ...updatedList]); // Same for filtered data
        } else {
            setData(updatedList);
            setFilteredData(updatedList);
        }

        closeModal();
    };

    const handleDelete = SweetAlertDelete(
        deleteProjectApi,
        data,
        setData,
        setFilteredData,
        searchText
    );

    const columns = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Project Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (text, record) => <span>{record.role.name}</span>,
        },
        {
            title: "Member",
            dataIndex: "member",
            key: "member",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Start Date",
            dataIndex: "start-date",
            key: "start-date",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Deadline",
            dataIndex: "deadline",
            key: "deadline",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Status',
            key: 'isActive',
            render: (record) => (<Badge status={record.isActive == true ? "success" : "warning"}
                text={
                    record.isActive == true ? "Active" : "Inactive"
                }
            />),
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
                    <Tooltip title="Edit">
                        <Button
                            onClick={() => openRightModal("formUpdate", record._id)}
                            shape="circle"
                            disabled={!canUpdateUser} // Check for permission to update
                        >
                            <FormOutlined />
                        </Button>
                    </Tooltip>
                    <Tooltip title="View">
                        <Button
                            onClick={() => navigate(`/employees/view/${record._id}`)}
                            shape="circle"
                            disabled={!canUpdateUser} // Check for permission to update
                        >
                            <EyeOutlined />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            onClick={() => handleDelete(record._id)}
                            shape="circle"
                            disabled={!canDeleteUser}
                        >
                            <DeleteOutlined />
                        </Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <Breadcrumb
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>Projects</span> }]}
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
                    <h2 className={Styles.headTitle}>Projects</h2>
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
                                <PlusOutlined className="mr-2" />
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
                <Table
                    columns={columns}
                    pagination={{
                        position: ["bottomRight"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
                        pageSizeOptions: ["10", "15", "20", "25", "30", "50"], // Options for page size
                        showSizeChanger: true, // Enable size changer
                        onShowSizeChange: handleShowSizeChange, // Handle page size change
                        pageSize, // Set current page size
                    }}
                    dataSource={filteredData}
                    rowKey={(record) => record._id || record.username}
                    components={{
                        body: {
                            cell: (props) => (
                                <td {...props} style={{ paddingTop: "4px", paddingBottom: "4px" }} />
                            ),
                        },
                    }}
                />
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? "Update Employee" : "Add New Project"}>
                    {activeForm === "form" && <CreateProject onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateProject userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout>
    );
};

export default Project;
