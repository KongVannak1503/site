import { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Table, Space, Input, Badge, Tooltip, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { Styles } from "../../components/utils/CustomStyle";
import {
    SearchOutlined,
    FormOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import SweetAlertDelete from "../../components/utils/SweetAlertDelete";
import jwt_decode from 'jwt-decode';
import { NEW_USER } from '../../components/utils/Constants';
import CenterSlideModal from '../../components/modals/ModalCenter';
import CreateRound from './CreateRound';
import UpdateRound from './UpdateRound';
import { deleteRoundApi, getRoundApi } from '../../components/apis/RoundApi';

const Round = () => {
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
    const [loading, setLoading] = useState(false);
    const handleShowSizeChange = (current, size) => {
        setPageSize(size); // Update page size state
    };

    useEffect(() => {
        document.title = "Rounds";
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
        }, 5000);
        const fetchData = async () => {
            try {
                const response = await getRoundApi();
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
            finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const canCreateUser = permissions['/round']?.includes('create');
    const canUpdateUser = permissions['/round']?.includes('update');
    const canDeleteUser = permissions['/round']?.includes('delete');

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
        deleteRoundApi,
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
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>Rounds</span> }]}
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
                    <h2 className={Styles.headTitle}>Rounds</h2>
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
                                {NEW_USER} Round
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
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Categories`,
                            pageSizeOptions: ["10", "15", "20", "25", "30", "50"], // Options for page size
                            showSizeChanger: true, // Enable size changer
                            onShowSizeChange: handleShowSizeChange, // Handle page size change
                            pageSize, // Set current page size
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
                <CenterSlideModal isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? "Update Round" : "Add New Round"}>
                    {activeForm === "form" && <CreateRound onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateRound userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModal>
            </Content>
        </Layout>
    );
};

export default Round;
