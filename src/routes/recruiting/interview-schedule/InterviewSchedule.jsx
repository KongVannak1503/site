import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useNavigate } from "react-router-dom";
import { Avatar, Breadcrumb, Card, Checkbox, Empty, Input, Layout, Segmented, Space, Spin, Table, Tooltip } from "antd";
import { AppstoreOutlined, BarsOutlined, DeleteOutlined, EditOutlined, FormOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";

import { Content } from "antd/es/layout/layout";
import jwt_decode from 'jwt-decode';
import CreateInterviewSchedule from "./CreateInterviewSchedule";
import UpdateInterviewSchedule from "./UpdateInterviewSchedule";
import { deleteInterviewScheduleApi, getInterviewScheduleApi } from "../../../components/apis/interviewScheduleApi";
import { formatDateAndTime, formatDateAndTimePoint, getDayFromDate, getMonthFromDate } from "../../../components/utils/Utils";
import SweetAlertDelete from "../../../components/utils/SweetAlertDelete";
import { uploadImage } from "../../../components/apis/UploadImageApi";
import { Styles } from "../../../components/utils/CustomStyle";
import { NEW_USER } from "../../../components/utils/Constants";
import CenterSlideModalLg from "../../../components/modals/ModalCenterLg";


const InterviewSchedule = () => {
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
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [events, setEvents] = useState([]);

    // State to manage the active view (either Table or Calendar)
    const [view, setView] = useState('List'); // Default view is 'List'

    const headTitle = 'Interview Schedule';
    useEffect(() => {
        document.title = headTitle;
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
        }, 5000);
        const fetchData = async () => {
            try {
                const response = await getInterviewScheduleApi();

                const formattedEvents = response.map(event => ({
                    id: event._id,
                    title: event.interviewId.name,
                    name: event.jobId.name,
                    start: new Date(formatDateAndTimePoint(event.startDate, event.startTime))
                }));
                setEvents(formattedEvents);

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

    const canCreateUser = permissions['/interview-schedule']?.includes('create');
    const canUpdateUser = permissions['/interview-schedule']?.includes('update');
    const canDeleteUser = permissions['/interview-schedule']?.includes('delete');

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            setFilteredData(data);
            setEvents(data.map(event => ({
                id: event._id,
                title: event.interviewId.name,
                name: event.jobId.name,
                start: new Date(formatDateAndTimePoint(event.startDate, event.startTime))
            })));
        } else {
            const filtered = data.filter((user) =>
                user.interviewId.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filtered);

            // Update events for FullCalendar
            setEvents(filtered.map(event => ({
                id: event._id,
                title: event.interviewId.name,
                name: event.jobId.name,
                start: new Date(formatDateAndTimePoint(event.startDate, event.startTime))
            })));
        }
    };


    const openRightModal = (form, dataId) => {
        setActiveForm(form);
        setLoading(true);
        if (form === "formUpdate") {
            setUpdateUserId(dataId);
        }
        setTimeout(() => {
            setLoading(false);
            setIsModalOpen(true);
        }, 300);
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

            setEvents([...events, {
                id: newUser._id,
                title: newUser.interviewId.name,
                name: newUser.jobId.name,
                start: new Date(formatDateAndTimePoint(newUser.startDate, newUser.startTime))
            }]);


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

            const updatedEvents = events.map((event) =>
                event.id === updatedData._id ? { ...event, title: updatedData.interviewId.name, name: updatedData.jobId.name, start: new Date(formatDateAndTimePoint(updatedData.startDate, updatedData.startTime)) } : event
            );

            setEvents(updatedEvents);
        } else {
            setData(updatedList);
            setFilteredData(updatedList);
        }

        closeModal();
    };


    const handleDelete = SweetAlertDelete(
        deleteInterviewScheduleApi,
        data,
        setData,
        setFilteredData,
        searchText
    );
    const localHandleDelete = async (id) => {
        try {
            const result = await handleDelete(id);

            if (result) {
                alert(1)
                setData(prevData => prevData.filter(item => item._id !== id));
                setFilteredData(prevFilteredData => prevFilteredData.filter(item => item._id !== id));

                // Remove from the events array to update the calendar view
                setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
            }

        } catch (error) {
            console.error("Error deleting:", error);
        }
    };




    const handleCheckAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(filteredData.map(item => item._id));
            setCheckedItems(allIds);
        } else {
            setCheckedItems(new Set());
        }
    };
    const handleCheck = (id) => {
        const newCheckedItems = new Set(checkedItems);
        if (newCheckedItems.has(id)) {
            newCheckedItems.delete(id);
        } else {
            newCheckedItems.add(id);
        }
        setCheckedItems(newCheckedItems);
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
            title: "Candidate",
            dataIndex: "candidateId",
            key: "candidateId",
            render: (text, record) => <span>{record.interviewId.name}</span>,
        },
        {
            title: "Interviewer",
            dataIndex: "employeeId",
            key: "employeeId",
            render: (text, record) => (
                <Space>
                    <Avatar src={uploadImage(record.employeeId.imgUrl)} alt={record.employeeId.imgUrl} />
                </Space>
            ),
        },
        {
            title: "Schedule Date And Time",
            dataIndex: "startDate",
            key: "startDate",
            render: (text, record) => (
                <span>{formatDateAndTime(record.startDate, record.startTime)}</span>
            ),
        },
        {
            title: "Interview Round",
            dataIndex: "roundId",
            key: "roundId",
            render: (text, record) => (
                <span>{record.roundId.name}</span>
            ),
        },


        {
            title: (
                <span style={{ display: "flex", justifyContent: "center", width: "100%" }} >
                    Action
                </span>
            ),
            key: "action",
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }} >
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
                            onClick={() => localHandleDelete(record._id)}
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
                items={[{ title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> }, { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>{headTitle}</span> }]}
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
                    <h2 className={Styles.headTitle}>{headTitle}</h2>
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
                                {NEW_USER} Interview Schedule
                            </button>
                        </div>
                        <div>
                            <Segmented
                                options={[
                                    {
                                        value: 'List',
                                        icon: <BarsOutlined />,
                                    },
                                    {
                                        value: 'Kanban',
                                        icon: <AppstoreOutlined />,
                                    },
                                ]}
                                value={view} // Bind value to the state
                                onChange={setView} // Update state when the segmented value changes
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <div>
                        {view === 'List' && (
                            <div className="grid grid-cols-1 md:grid-cols-[65%_35%] ">
                                <div className="p-4 shadow-[4px_0_5px_rgba(0,0,0,0.050)]">
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                        initialView="dayGridMonth"
                                        headerToolbar={{
                                            left: "prev today next",
                                            center: 'title',
                                            right: 'dayGridMonth,timeGridWeek,listWeek',
                                        }}
                                        events={events}
                                    // dateClick={() => openRightModal("form")}
                                    // eventClick={(info) => openRightModal("formUpdate", info.event.id)}
                                    />
                                </div>
                                <div className="md:p-4 md:pr-0">
                                    <h3 className="text-xl font-medium text-center mb-7">{headTitle}</h3>
                                    <div>
                                        {events.length > 0 ? (
                                            events.map((value) => (

                                                <Card
                                                    style={{ marginBottom: '10px' }}
                                                    key={value.id}
                                                    actions={[
                                                        <Tooltip key="reschedule" title="Reschedule">
                                                            <span><RedoOutlined /></span>
                                                        </Tooltip>,
                                                        <Tooltip key="edit" title="Edit">
                                                            <span onClick={() => openRightModal("formUpdate", value.id)}><EditOutlined /></span>
                                                        </Tooltip>,
                                                        <Tooltip key="delete" title="Delete">
                                                            <span onClick={() => localHandleDelete(value.id)}><DeleteOutlined /></span>
                                                        </Tooltip>,
                                                    ]}
                                                >
                                                    <div className="flex gap-3">
                                                        <div>
                                                            <div className="inline-flex flex-col border rounded-sm">
                                                                <button
                                                                    className="border-b-1 border-gray-500"
                                                                >
                                                                    {getMonthFromDate(value.start)}
                                                                </button>
                                                                <button
                                                                    className={`px-2 text-white}`}
                                                                >
                                                                    {getDayFromDate(value.start)}
                                                                </button>
                                                            </div>

                                                        </div>
                                                        <div>
                                                            <p className="text-base">{value.startDate}</p>
                                                            <p className="text-sm text-gray-400">
                                                                {formatDateAndTimePoint(value.start, value.start)}
                                                            </p>
                                                            <p className="text-sm text-gray-400">
                                                                {value.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <Empty description="No Data" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                )}
                {view === 'Kanban' && (
                    loading ? (
                        ""
                    ) : (
                        <div className="overflow-auto">
                            <Table
                                rowKey="_id"
                                columns={columns}
                                dataSource={filteredData}
                                pagination={{ pageSize: pageSize }}
                                onChange={(pagination) => setPageSize(pagination.pageSize)}
                            />
                        </div>
                    )
                )}
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? `Update Interview Schedule ${headTitle}` : `Add New ${headTitle}`}>
                    {activeForm === "form" && <CreateInterviewSchedule onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "formUpdate" && updateUserId && (
                        <UpdateInterviewSchedule userId={updateUserId} onUserUpdated={handleUpdate} onClose={closeModal} />
                    )}
                </CenterSlideModalLg>
            </Content>
        </Layout >
    );
};

export default InterviewSchedule;
