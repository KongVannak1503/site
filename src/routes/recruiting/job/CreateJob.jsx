import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Button, Checkbox, DatePicker, Form, Input, message, Select, Space } from "antd";
import { getSkillApi } from "../../../components/apis/SkillApi";
import { getCategoryApi } from "../../../components/apis/CategoryApi";
import { getSubCategoryApi } from "../../../components/apis/SubCategoryApi";
import { getDepartmentApi } from "../../../components/apis/DepartmentApi";
import { getRoundApi } from "../../../components/apis/RoundApi";
import { getEmployeeApi } from "../../../components/apis/EmployeeApi";
import { createJobApi } from "../../../components/apis/JobApi";
import { jobTypes, openStatuses, totalExperience } from "../../../components/utils/Constants";
import { uploadImage } from "../../../components/apis/UploadImageApi";
import { Styles } from "../../../components/utils/CustomStyle";
import CreateEmployee from "../../employees/employee/CreateEmployee";
import CenterSlideModalLg from "../../../components/modals/ModalCenterLg";
import CenterSlideModal from "../../../components/modals/ModalCenter";
import CreateCategory from "../../setting/category/CreateCategory";
import SubCreateCategory from "../../setting/sub-category/SubCreateCategory";
import CreateSkill from "../../setting/skill/CreateSkill";
import CreateRound from "../../setting/round/CreateRound";

const CreateJob = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [form] = Form.useForm();
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
        const fetchCategories = async () => {
            try {
                const JobData = await getSkillApi();
                const activeJob = JobData.filter((des) => des.isActive);
                setJobs(activeJob);

                const cateData = await getCategoryApi();
                const activeCategory = cateData.filter((des) => des.isActive);
                setCategory(activeCategory);

                const subCateData = await getSubCategoryApi();
                const activeSubCategory = subCateData.filter((des) => des.isActive);
                setSubCategory(activeSubCategory);

                const departData = await getDepartmentApi();
                const departDataActive = departData.filter((des) => des.isActive);
                setDepartment(departDataActive);

                const skillData = await getSkillApi();
                const skillDataActive = skillData.filter((des) => des.isActive);
                setSkills(skillDataActive);

                const intData = await getRoundApi();
                const intDataActive = intData.filter((des) => des.isActive);
                setInterviews(intDataActive);

                const empData = await getEmployeeApi();
                const empDataActive = empData.filter((des) => des.isActive);
                setEmployees(empDataActive);

            } catch (error) {
                message.error(error.message || "Failed to fetch categories.");
            }
        };

        fetchCategories();
    }, []);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createJobApi(formData);
            message.success('Job created successfully!');
            onUserCreated(response.data);
        } catch (error) {
            message.error(error.message || "Failed to create job.");
        } finally {
            setLoading(false);
        }
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

        setIsModalOpen(false); // Close modal after adding
    };
    return (
        <>
            <Form layout="vertical" initialValues={{ categoryId: null }} onFinish={onFinish}>
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


                <button type="submit" className={Styles.btnCreate} loading={loading ? true : undefined} >
                    Save
                </button>
                <button onClick={onClose} className={Styles.btnCancel}>
                    Cancel
                </button>
            </Form >
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

export default CreateJob;
