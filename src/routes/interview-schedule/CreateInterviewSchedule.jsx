import React, { useEffect, useState } from "react";
import { Form, Input, Switch, Button, message, Select, DatePicker, TimePicker, Checkbox } from "antd";
import { createInterviewScheduleApi } from "../../components/apis/interviewScheduleApi";
import { getJobApplicationApi } from "../../components/apis/JobApplicationApi";

import { Option } from "antd/es/mentions";
import { getCategoryApi } from "../../components/apis/CategoryApi";
import { getEmployeeApi } from "../../components/apis/EmployeeApi";
import { getRoundApi } from "../../components/apis/RoundApi";
import { interviewType, remindType } from "../../components/utils/Constants";


const CreateInterviewSchedule = ({ onUserCreated, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [sendReminder, setSendReminder] = useState(false);
    const handleCheckboxChange = (e) => {
        setSendReminder(e.target.checked);
    };

    useEffect(() => {
        const fetchRoles = async () => {
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

            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchRoles();
    }, []);

    const onFinish = async (formData) => {
        try {
            setLoading(true);
            const response = await createInterviewScheduleApi(formData);
            message.success('interview schedule created successfully!');
            onUserCreated(response.data);
        } catch (error) {
            message.error(error.message || "Failed to create interview schedule.");
        } finally {
            setLoading(false);
        }
    };

    console.log(candidates);

    return (
        <Form layout="vertical" onFinish={onFinish}>
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
                            <Option key={status.name} value={status._id}>
                                {status.name}
                            </Option>
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
                            <Option key={status.name} value={status._id}>
                                {status.name}
                            </Option>
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
                            <Option key={status.name} value={status._id}>
                                {status.name}
                            </Option>
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
                            <Option key={status.name} value={status._id}>
                                {status.name}
                            </Option>
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
            <Button type="primary" htmlType="submit" loading={loading} >
                Save
            </Button>
            <Button onClick={onClose} className="ml-3">
                Cancel
            </Button>
        </Form >
    );
};

export default CreateInterviewSchedule;
