import { Breadcrumb, Layout, Table, Space, Input, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Styles } from "../../components/utils/CustomStyle";
import {
    PlusOutlined,
    SearchOutlined,
    FormOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import CenterSlideModalLg from "../../components/modals/ModalCenterLg";
import CreateRole from "./CreateRole";
import SweetAlertDelete from "../../components/utils/SweetAlertDelete";
import { deleteRoleApi, getRoleApi } from "../../components/apis/RoleApi";
import UpdateRole from "./UpdateRole";
import { NEW_USER } from "../../components/utils/Constants";

const Role = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [activeForm, setActiveForm] = useState(null);
    const [updateRoleId, setUpdateRoleId] = useState(null);  // Store only the _id for update
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState(10);
    const handleShowSizeChange = (current, size) => {
        setPageSize(size); // Update page size state
    };
    useEffect(() => {
        document.title = "Roles";
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
        }, 5000);
        const fetchData = async () => {
            try {
                const response = await getRoleApi();

                if (response && Array.isArray(response.data)) {
                    setData(response.data);  // Use response.data instead of response
                    setFilteredData(response.data);
                } else {
                    console.error("Data is not an array:", response);
                    setData([]);
                    setFilteredData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    // Search function
    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            setFilteredData(data);
        } else {
            const filtered = data.filter(
                (role) =>
                    role.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    // Open modal
    const openRightModal = (form, dataId) => {
        setActiveForm(form);
        if (form === "formUpdate") {
            setUpdateRoleId(dataId);  // Set the _id for update
        }
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleAddCreated = async (newRole) => {
        try {
            console.log("new test" + { newRole });
            if (!newRole || !newRole._id) {
                console.error("New role object does not contain _id:", newRole);
                return;
            }
            // Update both data lists to reflect new role
            setData((prevData) => [newRole, ...prevData]);
            setFilteredData((prevData) => [newRole, ...prevData]);

            // Close modal after successful addition
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding role:", error);
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


    // Use SweetAlertDelete hook correctly
    const handleDelete = SweetAlertDelete(
        deleteRoleApi,
        data,
        setData,
        setFilteredData,
        searchText
    );

    // Table columns
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
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
                    <Button onClick={() => openRightModal("formUpdate", record._id)} shape="circle" color="default" variant="filled">
                        <FormOutlined />
                    </Button>
                    <Button
                        onClick={() => handleDelete(record._id)}
                        shape="circle"
                        color="default"
                        variant="filled"
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
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>Role</span> }]}
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
                    <h2 className={Styles.headTitle}>Roles</h2>
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
                            <button className={Styles.btnCreate} onClick={() => openRightModal("form")}>
                                {NEW_USER} Role
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
                {/* Modal for adding new role */}
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title="Add New Role">
                    {activeForm === "form" && <CreateRole onAddCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateRoleId && (
                        <UpdateRole roleId={updateRoleId} onUpdate={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout>
    );
};

export default Role;
