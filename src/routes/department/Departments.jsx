import { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Table, Space, Input, Button, Badge } from "antd";
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
import { deleteDepartmentApi, getDepartmentApi } from '../../components/apis/DepartmentApi';
import CreateDepartment from './CreateDepartment';
import UpdateDepartment from './UpdateDepartment';
import { NEW_USER } from '../../components/utils/Constants';

const Departments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [activeForm, setActiveForm] = useState(null);
    const [updateUserId, setUpdateUserId] = useState(null);
    const [permissions, setPermissions] = useState({});
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const handleShowSizeChange = (current, size) => {
        setPageSize(size); // Update page size state
    };

    useEffect(() => {
        document.title = "Designations";
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
        }, 5000);
        const fetchData = async () => {
            try {
                const response = await getDepartmentApi();
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

    const canCreateUser = permissions['/departments']?.includes('create');
    const canUpdateUser = permissions['/departments']?.includes('update');
    const canDeleteUser = permissions['/departments']?.includes('delete');

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
        deleteDepartmentApi,
        data,
        setData,
        setFilteredData,
        searchText
    );

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
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
                    <Button
                        onClick={() => openRightModal("formUpdate", record._id)}
                        shape="circle"
                        disabled={!canUpdateUser} // Check for permission to update
                    >
                        <FormOutlined />
                    </Button>
                    <Button
                        onClick={() => handleDelete(record._id)}
                        shape="circle"
                        disabled={!canDeleteUser}
                    >
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <Breadcrumb
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>Departments</span> }]}
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
                    <h2 className={Styles.headTitle}>Departments</h2>
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
                                {NEW_USER} Department
                            </button>
                        </div>
                    </div>
                </div>
                <Table
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                    pagination={{
                        position: ["bottomRight"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Departments`,
                        pageSizeOptions: ["10", "15", "20", "25", "30", "50"],
                        showSizeChanger: true,
                        onShowSizeChange: handleShowSizeChange,
                        pageSize,
                    }}
                    dataSource={filteredData}
                    rowKey={(record) => record._id || record.username}
                    components={{
                        body: {
                            cell: (props) => (
                                <td {...props} style={{ paddingTop: "8px", paddingBottom: "8px" }} />
                            ),
                        },
                    }}
                />

                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? "Update Department" : "Add New Department"}>
                    {activeForm === "form" && <CreateDepartment onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateDepartment userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout>
    );
};

export default Departments;
