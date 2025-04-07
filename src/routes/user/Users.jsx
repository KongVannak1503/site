import { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Table, Space, Input, Button, Tooltip } from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { getQueryApi, deleteQueryApi } from "../../components/apis/UserApi";
import { Styles } from "../../components/utils/CustomStyle";
import {
    SearchOutlined,
    FormOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import CreateUser from "./CreateUser";
import SweetAlertDelete from "../../components/utils/SweetAlertDelete";
import UpdateUser from "./UpdateUser";
import jwt_decode from 'jwt-decode';
import { NEW_USER } from '../../components/utils/Constants';
import CenterSlideModal from '../../components/modals/ModalCenter';
import { useLanguage } from '../../components/layouts/LanguageContext';
import { translate } from '../../components/utils/translations';
import { decodedToken } from '../../components/apis/MainApi';

const Users = () => {
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
    const { language } = useLanguage();

    useEffect(() => {
        document.title = translate('users');
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
        }, 5000);
        const fetchData = async () => {
            try {
                const response = await getQueryApi();
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

    const canCreateUser = permissions['/users']?.includes('create');
    const canUpdateUser = permissions['/users']?.includes('update');
    const canDeleteUser = permissions['/users']?.includes('delete');

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            setFilteredData(data);
        } else {
            const filtered = data.filter(
                (user) =>
                    user.username.toLowerCase().includes(value.toLowerCase()) ||
                    user.role?.name.toLowerCase().includes(value.toLowerCase())
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
        deleteQueryApi,
        data,
        setData,
        setFilteredData,
        searchText
    );

    const columns = [
        {
            title: translate('username'),
            dataIndex: "username",
            key: "username",
            render: (text) => <span>{text}</span>,
        },
        {
            title: translate('role'),
            dataIndex: "role",
            key: "role",
            render: (role) => <span>{role?.name || "N/A"}</span>,
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
                            className={Styles.btnEdit}
                            onClick={() => openRightModal("formUpdate", record._id)}
                            shape="circle"
                            disabled={!canUpdateUser}
                        >
                            <FormOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={translate('delete')}>
                        <button
                            className={`${Styles.btnDelete} ${!canDeleteUser || decodedToken.userId == record._id ? 'cursor-not-allowed ' : 'cursor-pointer'}`}
                            onClick={() => handleDelete(record._id)}
                            shape="circle"
                            disabled={!canDeleteUser || decodedToken.userId == record._id}
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
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>{translate('home')}</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>{translate('users')}</span> }]}
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
                    <h2 className={Styles.headTitle}>{translate('users')}</h2>
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
                                {NEW_USER} {translate('user')} {translate('new')}
                            </button>
                        </div>
                    </div>
                </div>
                <Table
                    columns={columns}
                    pagination={{
                        position: ["bottomRight"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} ${translate('of')} ${total} ${translate('entries')}`,
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
                <CenterSlideModal isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? ` ${translate('update')} ${translate('user')}` : ` ${translate('add')} ${translate('user')} ${translate('new')}`}>
                    {activeForm === "form" && <CreateUser onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateUser userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModal>
            </Content>
        </Layout>
    );
};

export default Users;
