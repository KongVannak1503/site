import React, { useState, useEffect } from "react";
import { Form, Input, message, Select, Checkbox, TimePicker, DatePicker } from "antd";
import { interviewType, remindType } from "../../../components/utils/Constants";
import { Styles } from "../../../components/utils/CustomStyle";
import { Option } from "antd/es/mentions";
import { getCategoryApi } from "../../../components/apis/CategoryApi";
import { getJobApplicationApi } from "../../../components/apis/JobApplicationApi";
import { getEmployeeApi } from "../../../components/apis/EmployeeApi";
import { getRoundApi } from "../../../components/apis/RoundApi";
import { updateInterviewScheduleApi, viewInterviewScheduleUpdateApi } from "../../../components/apis/interviewScheduleApi";
import dayjs from "dayjs";

const UpdateInterviewSchedule = ({ userId, onUserUpdated, onClose }) => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [sendReminder, setSendReminder] = useState(false);
    const handleCheckboxChange = (e) => {
        setSendReminder(e.target.checked);
    };

    // Populate form with existing values when editing
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const jobDate = await getCategoryApi();
                const activeJob = jobDate.filter(des => des.isActive);
                setJobs(activeJob);
                const CandidateDate = await getJobApplicationApi();
                setCandidates(CandidateDate);

                const EmpDate = await getEmployeeApi();
                const activeEmp = EmpDate.filter(des => des.isActive);
                setEmployees(activeEmp);

                const RoundDate = await getRoundApi();
                const activeRound = RoundDate.filter(des => des.isActive);
                setRounds(activeRound);
                const response = await viewInterviewScheduleUpdateApi(userId);
                const interviewData = response.data;
                console.log(interviewData);

                form.setFieldsValue({
                    jobId: interviewData.jobId,
                    interviewId: interviewData.interviewId,
                    employeeId: interviewData.employeeId,
                    roundId: interviewData.roundId,
                    interviewType: interviewData.interviewType,
                    startDate: dayjs(interviewData.startDate),
                    startTime: dayjs(interviewData.startTime, 'HH:mm:ss'),
                    commentInterviewer: interviewData.commentInterviewer,
                    isNotify: interviewData.isNotify,
                    none: interviewData.none,
                    remind: interviewData.remind,
                    remindType: interviewData.remindType,
                });
            } catch (error) {
                message.error('Failed to fetch user data');
                console.error('Error:', error);
            }
        };
        fetchUserData();
    }, [userId, form]);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await updateInterviewScheduleApi(userId, formData);
            message.success("Skill updated successfully!");
            onUserUpdated(response.data);
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to update skill.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Name Input */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item
                    name="jobId"
                    label="Job"
                    rules={[{ required: true, message: 'Job is required' }]}
                >
                    <Select placeholder="Select Job" showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }>
                        {jobs.map(status => (
                            <Select.Option key={status.name} value={status._id}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>

                </Form.Item>
                <Form.Item
                    name="interviewId"
                    label="Candidate"
                    rules={[{ required: true, message: 'Candidate is required' }]}
                >
                    <Select placeholder="Select Candidate" showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }>
                        {candidates.map(status => (
                            <Select.Option key={status.name} value={status._id}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>

                </Form.Item>

                <Form.Item
                    name="employeeId"
                    label="Interviewer"
                    rules={[{ required: true, message: 'Interviewer is required' }]}
                >
                    <Select placeholder="Select Interviewer"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }>
                        {employees.map(status => (
                            <Select.Option key={status.name} value={status._id}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>

                </Form.Item>

                <Form.Item
                    name="roundId"
                    label="Round"
                    rules={[{ required: true, message: 'Round is required' }]}
                >
                    <Select placeholder="Select Round" showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }>
                        {rounds.map(status => (
                            <Select.Option key={status.name} value={status._id}>
                                {status.name}
                            </Select.Option>
                        ))}
                    </Select>

                </Form.Item>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item
                    name="interviewType"
                    label="Interview Type"
                >
                    <Select
                        placeholder="Select a Interview Type"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {interviewType.map((status) => (
                            <Select.Option key={status.name} value={status.name}>
                                <span>{status.name}</span>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item

                    name="startDate"
                    label="Start On"
                    rules={[{ required: true, message: 'Start On is required' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        placeholder="Select Date"
                    />
                </Form.Item>
                <Form.Item
                    name="startTime"
                    label="Start Time"
                    rules={[{ required: true, message: 'Start Time is required' }]}
                >
                    <TimePicker
                        style={{ width: '100%' }}
                        format="HH:mm:ss"
                        placeholder="Select Time"
                        use12Hours={false}
                    />
                </Form.Item>
            </div>
            <Form.Item
                name="commentInterviewer"
                label="Comment for Interviewer"
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item name="isNotify" valuePropName="checked" >
                <Checkbox>Notify Candidate</Checkbox>
            </Form.Item>
            <Form.Item name="none" valuePropName="checked">
                <Checkbox onChange={handleCheckboxChange}>Send Reminder</Checkbox>
            </Form.Item>

            {sendReminder && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Form.Item
                        name="remind"
                        label="Remind before"
                        rules={[{ required: true, message: 'Please input reminder time' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="remindType"
                        label=" "
                        initialValue={1}
                        rules={[{ required: true, message: 'Please select a reminder type' }]}
                    >
                        <Select>
                            {remindType.map((status) => (
                                <Select.Option key={status.name} value={status.value}>
                                    <span>{status.name}</span>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
            )}
            <button type="submit" className={Styles.btnUpdate} loading={loading}>
                Update
            </button>
            <button onClick={onClose} className={Styles.btnCancel}>
                Cancel
            </button>
        </Form>
    );
};

export default UpdateInterviewSchedule;
