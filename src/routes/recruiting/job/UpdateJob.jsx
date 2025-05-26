import React, { useState, useEffect } from 'react';
import { message, Form, Input, Button, Select, Checkbox, Space, DatePicker } from 'antd';
import ReactQuill from 'react-quill';
import dayjs from 'dayjs';
import moment from 'moment';
import { getSkillApi } from '../../../components/apis/SkillApi';
import { getCategoryApi } from '../../../components/apis/CategoryApi';
import { getSubCategoryApi } from '../../../components/apis/SubCategoryApi';
import { getDepartmentApi } from '../../../components/apis/DepartmentApi';
import { getRoundApi } from '../../../components/apis/RoundApi';
import { getEmployeeApi } from '../../../components/apis/EmployeeApi';
import { updateJobApi, viewJobUpdateApi } from '../../../components/apis/JobApi';
import { jobTypes, openStatuses, totalExperience } from '../../../components/utils/Constants';
import { uploadImage } from '../../../components/apis/UploadImageApi';
import { Styles } from '../../../components/utils/CustomStyle';
import CenterSlideModalLg from '../../../components/modals/ModalCenterLg';
import CreateEmployee from '../../employees/employee/CreateEmployee';
import CenterSlideModal from '../../../components/modals/ModalCenter';
import CreateCategory from '../../setting/category/CreateCategory';
import SubCreateCategory from '../../setting/sub-category/SubCreateCategory';
import CreateSkill from '../../setting/skill/CreateSkill';
import CreateRound from '../../setting/round/CreateRound';

const UpdateJob = ({ userId, onUserUpdated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [jobs, setJobs] = useState([]);
    const [summary, setSummary] = useState("");
    const [activeForm, setActiveForm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [department, setDepartment] = useState([]);
    const [skills, setSkills] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [employees, setEmployees] = useState([]);

    const openRightModal = (form, dataId) => {
        setActiveForm(form);

        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchApplicationData = async () => {
            try {
                // 1. Fetch all required dropdown data
                const JobData = await getSkillApi();
                setJobs(JobData.filter((des) => des.isActive));

                const cateData = await getCategoryApi();
                setCategory(cateData.filter((des) => des.isActive));

                const subCateData = await getSubCategoryApi();
                setSubCategory(subCateData.filter((des) => des.isActive));

                const departData = await getDepartmentApi();
                setDepartment(departData.filter((des) => des.isActive));

                const skillData = await getSkillApi();
                setSkills(skillData.filter((des) => des.isActive));

                const intData = await getRoundApi();
                setInterviews(intData.filter((des) => des.isActive));

                const empData = await getEmployeeApi();
                setEmployees(empData.filter((des) => des.isActive));

                // 2. Fetch job data
                const resp = await viewJobUpdateApi(userId);
                const jobData = resp.data;
                setSummary("hello");

                // 3. Set form values — AFTER options are ready
                form.setFieldsValue({
                    _id: jobData._id,
                    name: jobData.name,
                    categoryId: jobData.categoryId,
                    subCategoryId: jobData.subCategoryId,
                    departmentId: jobData.departmentId,
                    skillId: jobData.skillId,
                    startDate: jobData.startDate ? moment(jobData.startDate) : null,
                    endDate: jobData.endDate ? moment(jobData.endDate) : null,
                    unlimited: jobData.status,
                    totalOpening: jobData.totalOpening,
                    location: jobData.location,
                    interviewId: jobData.interviewId,
                    employeeId: jobData.employeeId,
                    description: jobData.description,
                    status: jobData.status,
                });

                setSelectedCategoryId(jobData.categoryId);

            } catch (error) {
                message.error('Failed to fetch job application data');
                console.error(error);
            }
        };

        fetchApplicationData();
    }, [userId, form]);

    console.log(userId);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await updateJobApi(userId, values);
            message.success('Job updated successfully!');
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error('Failed to update job');
            console.error(error);
        }
        setLoading(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleAddCreated = (newItem) => {
        if (!newItem || !newItem._id) return;

        if (activeForm === "form") {
            setCategory((prev) => [newItem, ...prev]);
        } else if (activeForm === "subCategory") {
            setSubCategory((prev) => [newItem, ...prev]);

        } else if (activeForm === "skillForm") {
            setSkills((prev) => [newItem, ...prev]);
        } else if (activeForm === "roundForm") {
            setInterviews((prev) => [newItem, ...prev]);
        }

        setIsModalOpen(false);
    };

    return (
        <>
            <Form form={form} onFinish={onFinish} layout="vertical">
                {/* Name Input */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Form.Item
                        label="Job Title"
                        name="name"
                        rules={[{ required: true, message: "Please enter job title" }]}
                    >
                        <Input />
                    </Form.Item>
                    <div>
                        <Space.Compact style={{ width: "100%" }} className="flex items-end">
                            <Form.Item
                                label="Job Category"
                                name="categoryId"
                                rules={[{ required: true, message: "Please enter job category" }]}
                                style={{ width: "80%", marginBottom: 0 }}  // Remove bottom margin for better alignment
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={(value) => {
                                        setSelectedCategoryId(value);
                                    }}
                                >
                                    {category.map((cate) => (
                                        <Select.Option key={cate._id} value={cate._id}>
                                            {cate.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Button type="dashed" onClick={() => openRightModal("form")}>
                                Add
                            </Button>
                        </Space.Compact>
                    </div>
                    <div>
                        <Space.Compact style={{ width: "100%" }} className="flex items-end">
                            <Form.Item
                                label="Sub Category"
                                name="subCategoryId"
                                style={{ width: "80%", marginBottom: 0 }}
                                rules={[{ required: true, message: "Please enter sub category" }]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children" // Allows filtering based on the option's text
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {subCategory
                                        .filter((subCate) => subCate.categoryId._id === selectedCategoryId)
                                        .map((subCate) => (
                                            <Select.Option key={subCate._id} value={subCate._id}>
                                                {subCate.name}
                                            </Select.Option>
                                        ))}
                                </Select>

                            </Form.Item>
                            <Button type="dashed"
                                onClick={() => openRightModal("subCategory")}
                            >
                                Add
                            </Button>
                        </Space.Compact>
                    </div>
                    <Form.Item
                        label="Department"
                        name="departmentId"
                        rules={[{ required: true, message: "Please enter Department" }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {department

                                .map((subCate) => (
                                    <Select.Option key={subCate._id} value={subCate._id}>
                                        {subCate.name}
                                    </Select.Option>
                                ))}
                        </Select>

                    </Form.Item>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Space.Compact style={{ width: "100%" }} className="flex items-end">

                            <Form.Item
                                label="Skills"
                                name="skillId"
                                rules={[{ required: true, message: "Please select at least one skill" }]}
                                style={{ width: "80%", marginBottom: 0 }}
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    style={{ flex: "1 1 auto", minWidth: "0" }} // Prevents breaking
                                    optionFilterProp="children"
                                    maxTagCount="responsive" // Keeps selected items inline
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {skills.map((cate) => (
                                        <Select.Option key={cate._id} value={cate._id}>
                                            {cate.name}
                                        </Select.Option>
                                    ))}
                                </Select>

                            </Form.Item>
                            <Button type="dashed" onClick={() => openRightModal("skillForm")}>
                                Add
                            </Button>
                        </Space.Compact>
                    </div>
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: "Please select start date" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }} // Makes it full width
                            format="YYYY-MM-DD"
                        />

                    </Form.Item>
                    <Form.Item
                        label="End Date"
                        name="endDate"
                    // rules={[{ required: true, message: "Please select end date" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }} // Makes it full width
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>

                    <Form.Item label=" " name="unlimited" valuePropName="checked">
                        <Checkbox>No End Date</Checkbox>
                    </Form.Item>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Space.Compact style={{ width: "100%" }} className="flex items-end">

                            <Form.Item
                                label="Interview Round"
                                name="interviewId"
                                style={{ width: "100%", marginBottom: 0 }}
                                rules={[{ required: true, message: "Please select at least one interview round" }]}
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    style={{ flex: "1 1 auto", minWidth: "0" }}
                                    optionFilterProp="children"
                                    maxTagCount="responsive"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {interviews.map((cate) => (
                                        <Select.Option key={cate._id} value={cate._id}>
                                            {cate.name}
                                        </Select.Option>
                                    ))}
                                </Select>

                            </Form.Item>
                            <Button type="dashed" onClick={() => openRightModal("roundForm")}>
                                Add
                            </Button>
                        </Space.Compact>
                    </div>
                    <Form.Item
                        label="Total Openings"
                        name="totalOpening"
                        rules={[{ required: true, message: "Please enter total openings" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Select status" }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {openStatuses.map((status) => (
                                <Select.Option key={status.name} value={status.value}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                backgroundColor: status.color, // Using the color defined for each status
                                            }}
                                        />
                                        <span>{status.name}</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div>
                        <Space.Compact style={{ width: "100%" }} className="flex items-end">
                            <Form.Item
                                label="Recruiter"
                                name="employeeId"
                                rules={[{ required: true, message: "Please select recruiter" }]}
                                style={{ width: "80%", marginBottom: 0 }}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="label" // Use label for filtering
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                    optionLabelProp="label"
                                >
                                    {employees.map((emp) => (
                                        <Select.Option
                                            key={emp._id}
                                            value={emp._id}
                                            label={emp.name} // Ensure proper filtering
                                        >
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={uploadImage(emp.imgUrl)}
                                                    alt={emp.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <span className="font-medium">{emp.name}</span>
                                                    <br />
                                                    <span className="text-gray-500 text-xs">{emp.email}</span>
                                                </div>
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>

                            </Form.Item>
                            <Button type="dashed"
                                onClick={() => openRightModal("employeeForm")}
                            >
                                Add
                            </Button>
                        </Space.Compact>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <Form.Item
                        label="Job Type"
                        name="jobType"
                        rules={[{ required: true, message: "Please select job type" }]}
                    >
                        <Select

                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {jobTypes.map((cate) => (
                                <Select.Option key={cate.name} value={cate.name}>
                                    {cate.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Work Experience"
                        name="experience"
                        rules={[{ required: true, message: "Please select job type" }]}
                    >
                        <Select

                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {totalExperience.map((cate) => (
                                <Select.Option key={cate.name} value={cate.name}>
                                    {cate.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item
                    label="Location"
                    name="location"

                >
                    <ReactQuill theme="snow" value={summary} onChange={setSummary} />
                </Form.Item>
                <Form.Item name="description" label="Description" >
                    <ReactQuill theme="snow" value={summary} onChange={setSummary} />
                </Form.Item>

                <div className="mb-4">
                    <Form.Item name="isEmail" valuePropName="checked" noStyle>
                        <Checkbox>Send Email Notification to Job Application</Checkbox>
                    </Form.Item>
                </div>
                {/* isActive Switch */}


                <button type="submit" className={Styles.btnCreate} loading={loading} >
                    Save
                </button>
                <button onClick={onClose} className={Styles.btnCancel}>
                    Cancel
                </button>
            </Form>
            {activeForm === "employeeForm" ?
                <CenterSlideModalLg isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? "Update Employee" : "Add New"}>
                    {activeForm === "employeeForm" && <CreateEmployee onUserCreated={handleAddCreated} onClose={closeModal} />}
                </CenterSlideModalLg>
                :
                <CenterSlideModal isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? "Update Employee" : "Add New"}>
                    {activeForm === "form" && <CreateCategory onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "subCategory" && <SubCreateCategory onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "skillForm" && <CreateSkill onUserCreated={handleAddCreated} onClose={closeModal} />}
                    {activeForm === "roundForm" && <CreateRound onUserCreated={handleAddCreated} onClose={closeModal} />}

                </CenterSlideModal>
            }
        </>
    );
};

export default UpdateJob;