import { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Table, Space, Input, Button, Avatar, Badge, Tooltip, Checkbox, Spin } from "antd";
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
import CreateEmployee from './CreateEmployee';
import { deleteEmployeeApi, getEmployeeApi } from '../../components/apis/EmployeeApi';
import { uploadImage } from '../../components/apis/UploadImageApi';
import UpdateEmployee from './UpdateEmployee';
import { NEW_USER, PAGINATION_SPACE, PAGINATION_TITLE } from '../../components/utils/Constants';
import { useLanguage } from '../../components/layouts/LanguageContext';
import { translate } from '../../components/utils/Translations';
import { decodedToken } from '../../components/apis/MainApi';

const Employees = () => {
    const { language } = useLanguage();
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
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const handleShowSizeChange = (current, size) => {
        setPageSize(size); // Update page size state
    };

    useEffect(() => {
        document.title = translate('employees'),
            setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
        }, 5000);
        const fetchData = async () => {
            try {
                const response = await getEmployeeApi();
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
    }, [token, language]);

    const canCreateUser = permissions['/employees']?.includes('create');
    const canUpdateUser = permissions['/employees']?.includes('update');
    const canDeleteUser = permissions['/employees']?.includes('delete');

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
        deleteEmployeeApi,
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
            title: translate('employeeId'),
            dataIndex: "employeeId",
            key: "employeeId",
            render: (text) => <span>{text}</span>,
        },
        {
            title: translate('name'),
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Space>
                    <Avatar src={uploadImage(record.imgUrl)} alt={record.imgUrl} />
                    <div className=''>
                        <span>{text}</span>
                        <p className='text-sm text-gray-500'>{record.designation.name}</p>
                    </div>
                </Space>
            ),
        },
        {
            title: translate('role'),
            dataIndex: "role",
            key: "role",
            render: (text, record) => <span>{record.role.name}</span>,
        },
        {
            title: translate('email'),
            dataIndex: "email",
            key: "email",
            render: (text) => <span>{text}</span>,
        },
        {
            title: translate('status'),
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
                    {translate('action')}
                </span>
            ),
            key: "action",
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title={translate('edit')}>
                        <button
                            onClick={() => openRightModal("formUpdate", record._id)}
                            shape="circle"
                            disabled={!canUpdateUser}
                            className={Styles.btnEdit}
                        >
                            <FormOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={translate('view')}>
                        <Button
                            onClick={() => navigate(`/employees/view/${record._id}`)}
                            shape="circle"
                            disabled={!canUpdateUser} // Check for permission to update
                        >
                            <EyeOutlined />
                        </Button>
                    </Tooltip>
                    <Tooltip title={translate('delete')}>
                        <button
                            className={`${Styles.btnDelete} ${!canDeleteUser || decodedToken.empId == record._id ? 'cursor-not-allowed ' : 'cursor-pointer'}`}
                            onClick={() => handleDelete(record._id)}
                            shape="circle"
                            disabled={!canDeleteUser || decodedToken.empId == record._id}
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
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>{translate('home')}</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>{translate('employees')}</span> }]}
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
                <div className="flex flex-col md:flex-row justify-between pb-5">
                    <h2 className={Styles.headTitle}>{translate('employees')}</h2>
                    <div className="flex items-center gap-4">
                        <div>
                            <Input
                                placeholder={translate('search')}
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
                                {NEW_USER} {translate('newEmployee')}
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
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? translate('updateEmployee') : translate('newEmployee')}>
                    {activeForm === "form" && <CreateEmployee onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateEmployee userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout>
    );
};

export default Employees;
