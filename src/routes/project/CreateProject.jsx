import React, { act, useEffect, useState } from "react";
import { Form, Input, Button, message, DatePicker, Checkbox, Upload, Select, Space } from "antd";
import { DownOutlined, InboxOutlined, UpOutlined } from "@ant-design/icons";
import { createProjectApi } from "../../components/apis/ProjectApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getCategoryApi } from "../../components/apis/CategoryApi";
import CenterSlideModal from "../../components/modals/ModalCenter";
import CreateCategory from "../category/CreateCategory";
import { getDepartmentApi } from "../../components/apis/DepartmentApi";
import { getEmployeeApi } from "../../components/apis/EmployeeApi";
import { uploadImage } from "../../components/apis/UploadImageApi";

const { Dragger } = Upload;

const CreateProject = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const unlimited = Form.useWatch("unlimited", form);
    const [summary, setSummary] = useState("");
    const [note, setNote] = useState("");
    const [fileList, setFileList] = useState([]);
    const [category, setCategory] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showOtherDetails, setShowOtherDetails] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    const openRightModal = (form, dataId) => {
        setActiveForm(form);

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cateData = await getCategoryApi();
                const activeCategory = cateData.filter((des) => des.isActive);
                setCategory(activeCategory);

                const departData = await getDepartmentApi();
                const activeDepartment = departData.filter((des) => des.isActive);
                setDepartments(activeDepartment);

                const empData = await getEmployeeApi();
                const activeEmployees = empData.filter((des) => des.isActive);
                setEmployees(activeEmployees);
            } catch (error) {
                message.error(error.message || "Failed to fetch categories.");
            }
        };

        fetchCategories();
    }, []);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createProjectApi(formData);
            message.success("Project created successfully!");
            onUserCreated(response.data);
        } catch (error) {
            message.error(error.message || "Failed to create project.");
        } finally {
            setLoading(false);
        }
    };
    const handleAddCreated = (newCategory) => {
        try {
            if (!newCategory || !newCategory._id) {
                console.error("New category object does not contain _id:", newCategory);
                return;
            }

            // Update the categories state to include the newly added category
            setCategory((prevCategories) => [newCategory, ...prevCategories]);

            setIsModalOpen(false); // Close modal after adding
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };
    return (
        <>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Form.Item
                            name="code"
                            label="Short Code"
                            rules={[{ required: true, message: "Short Code is required" }]}
                        >
                            <Input placeholder="Enter Code" />
                        </Form.Item>
                    </div>
                    <div className="col-span-2">
                        <Form.Item
                            name="projectName"
                            label="Project Name"
                            rules={[{ required: true, message: "Project Name is required" }]}
                        >
                            <Input placeholder="Enter Project Name" />
                        </Form.Item>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Form.Item
                            name="startDate"
                            label="Start Date"
                            rules={[{ required: true, message: "Start Date is required" }]}
                        >
                            <DatePicker className="w-full" placeholder="Select Start Date" format="YYYY-MM-DD" />
                        </Form.Item>
                    </div>

                    {!unlimited && (
                        <div>
                            <Form.Item
                                name="endDate"
                                label="Deadline"
                                rules={[{ required: true, message: "Deadline is required" }]}
                            >
                                <DatePicker className="w-full" placeholder="Select Deadline" format="YYYY-MM-DD" />
                            </Form.Item>
                        </div>
                    )}

                    <div>
                        <Form.Item label=" " name="unlimited" valuePropName="checked">
                            <Checkbox>There is no project deadline</Checkbox>
                        </Form.Item>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Form.Item
                            name="categoryId"
                            label="Project Category"
                            rules={[{ required: true, message: "Project Category is required" }]}
                        >
                            <Space.Compact style={{ width: "100%" }}>
                                <Select
                                    placeholder="Select a Category"
                                    showSearch
                                    style={{ width: "80%" }}
                                    optionFilterProp="children" // Allows filtering based on the option's text
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {category.map((cate) => (
                                        <Select.Option key={cate._id} value={cate._id}>
                                            {cate.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <Button type="dashed"
                                    onClick={() => openRightModal("form")}
                                >
                                    Add
                                </Button>
                            </Space.Compact>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            name="departmentId"
                            label="Department"
                            rules={[{ required: true, message: "Department is required" }]}
                        >
                            <Select
                                mode="multiple"  // Enables multi-select
                                placeholder="Select a Department"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {departments.map((dept) => (
                                    <Select.Option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </div>
                    <div>
                        <Form.Item
                            name="client"
                            label="Client"
                            rules={[{ required: true, message: "Client is required" }]}
                        >
                            <Select
                                placeholder="Select a Client"
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


                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Form.Item name="summary" label="Project Summary" required>
                            <ReactQuill theme="snow" value={summary} onChange={setSummary} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name="note" label="Notes" required>
                            <ReactQuill theme="snow" value={note} onChange={setNote} />
                        </Form.Item>
                    </div>
                </div>

                <div>
                    <Form.Item name="member" label="Add Project Members" required>
                        <Input placeholder="Enter Client" />
                    </Form.Item>
                </div>

                <h3
                    className="font-medium text-lg mb-4  cursor-pointer"
                    onClick={() => setShowOtherDetails(!showOtherDetails)}
                >
                    {showOtherDetails ? <UpOutlined /> : <DownOutlined />}  Other Details

                </h3>

                {/* Collapsible Content */}
                {showOtherDetails && (
                    <div className="animate-fadeIn">
                        <Form.Item name="file" label="Add file">
                            <Dragger
                                fileList={fileList}
                                beforeUpload={(file) => {
                                    setFileList([file]); // Only keep the latest file
                                    return false; // Prevent auto-upload
                                }}
                                onRemove={() => setFileList([])}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag a file to this area to upload</p>
                                <p className="ant-upload-hint">Only one file is allowed.</p>
                            </Dragger>
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Form.Item name="currency" label="Currency">
                                    <Input placeholder="Enter Currency" />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item name="budget" label="Project Budget">
                                    <Input placeholder="Enter Budget" />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item name="estimate" label="Hours Estimate (In Hours)">
                                    <Input placeholder="Enter Estimate" />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                )}

                <div className="my-6"></div>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Save
                </Button>
                <Button onClick={onClose} className="ml-3">
                    Cancel
                </Button>

            </Form >
            <CenterSlideModal isOpen={isModalOpen} onClose={closeModal} title={activeForm === "formUpdate" ? "Update Employee" : "Add New Project"}>
                {activeForm === "form" && <CreateCategory onUserCreated={handleAddCreated} onClose={closeModal} />}
            </CenterSlideModal>
        </>
    );
};

export default CreateProject;
