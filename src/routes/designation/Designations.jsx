import { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Table, Space, Input, Button, Badge, Checkbox, Spin, Select, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { Styles } from "../../components/utils/CustomStyle";
import {
    PlusOutlined,
    SearchOutlined,
    FormOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import CenterSlideModalLg from "../../components/modals/ModalCenterLg";
import SweetAlertDelete from "../../components/utils/SweetAlertDelete";
import jwt_decode from 'jwt-decode';
import CreateDesignation from './CreateDesignation';
import { deleteDesignationApi, getDesignationApi, updateDesignStatusApi, updateDesignStatusesApi } from '../../components/apis/DesignationApi';
import UpdateDesignation from './UpdateDesignation';
import { defaultStatuses, EDIT_USER, NEW_USER } from '../../components/utils/Constants';

const Designations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [activeForm, setActiveForm] = useState(null);
    const [updateUserId, setUpdateUserId] = useState(null);
    const [permissions, setPermissions] = useState({});
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const handleShowSizeChange = (current, size) => {
        setPageSize(size); // Update page size state
    };

    useEffect(() => {
        document.title = "Designations";
        const fetchData = async () => {
            setLoading(true);
            const timeoutId = setTimeout(() => {
                setLoading(true);
            }, 5000);
            try {
                const response = await getDesignationApi();
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

    const canCreateUser = permissions['/designations']?.includes('create');
    const canUpdateUser = permissions['/designations']?.includes('update');
    const canDeleteUser = permissions['/designations']?.includes('delete');

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
        deleteDesignationApi,
        data,
        setData,
        setFilteredData,
        searchText
    );
    const handleCheck = (id) => {
        const newCheckedItems = new Set(checkedItems);
        if (newCheckedItems.has(id)) {
            newCheckedItems.delete(id);
        } else {
            newCheckedItems.add(id);
        }
        setCheckedItems(newCheckedItems);
    };

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(filteredData.map(item => item._id));
            setCheckedItems(allIds);
        } else {
            setCheckedItems(new Set());
        }
    };

    const handleStatusChange = async (newStatus, applicationId) => {
        try {
            await updateDesignStatusApi(applicationId, newStatus);

            const updatedData = data.map((item) =>
                item._id === applicationId ? { ...item, isActive: newStatus } : item
            );
            setData(updatedData);
            setFilteredData(updatedData);
            message.success('Status updated successfully!');
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleBulkStatusChange = async (newStatus) => {
        if (checkedItems.size === 0) {
            message.warning("Please select at least one designation.");
            return;
        }

        try {
            setLoading(true);

            await updateDesignStatusesApi(Array.from(checkedItems), newStatus);
            message.success("Status updated successfully.");

            // Update the UI with the new status
            setData(prevData =>
                prevData.map(item =>
                    checkedItems.has(item._id) ? { ...item, isActive: newStatus } : item
                )
            );
            setFilteredData(prevData =>
                prevData.map(item =>
                    checkedItems.has(item._id) ? { ...item, isActive: newStatus } : item
                )
            );

            setCheckedItems(new Set()); // Clear selected checkboxes
        } catch (error) {
            console.error("Error updating status:", error);
            message.error("Failed to update status.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: (
                <Checkbox
                    onChange={handleCheckAll}
                    checked={data.length > 0 && checkedItems.size === data.length}
                />
            ),
            key: 'check',
            render: (record) => (
                <Checkbox
                    checked={checkedItems.has(record._id)}
                    onChange={() => handleCheck(record._id)}
                />
            ),
            width: 50,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Status",
            key: "isActive",
            dataIndex: "isActive",
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
                            {defaultStatuses.map((status) => (
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
                    <button
                        className={Styles.btnEdit}
                        onClick={() => openRightModal("formUpdate", record._id)}
                        shape="circle"
                        disabled={!canUpdateUser} // Check for permission to update
                    >
                        <FormOutlined />
                    </button>
                    <button
                        className={Styles.btnDelete}
                        onClick={() => handleDelete(record._id)}
                        shape="circle"
                        disabled={!canDeleteUser}
                    >
                        <DeleteOutlined />
                    </button>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <Breadcrumb
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>Designations</span> }]}
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
                    <h2 className={Styles.headTitle}>Designations</h2>
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
                                {NEW_USER} Designation
                            </button>
                        </div>
                        {checkedItems.size > 0 && (
                            <div>
                                <Select
                                    className="w-[120px]"
                                    placeholder="Select a status"
                                    showSearch
                                    optionFilterProp="label"
                                    filterOption={(input, option) =>
                                        option?.label?.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={(newStatus) => handleBulkStatusChange(newStatus)}
                                >
                                    {defaultStatuses.map((status) => (
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
                        )}

                    </div>
                </div>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        scroll={{ x: 'max-content' }}
                        loading={loading}
                        pagination={{
                            position: ["bottomRight"],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Designations`,
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
                                    <td {...props} style={{ paddingTop: "8px", paddingBottom: "8px" }} />
                                ),
                            },
                        }}
                    />
                )}
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? `${EDIT_USER} Designation` : "Add New Designation"}>
                    {activeForm === "form" && <CreateDesignation onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateDesignation userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout>
    );
};

export default Designations;
