import React, { useEffect, useState } from 'react'
import Header from './Header'
import { viewEmployeeByIdApi } from '../../components/apis/EmployeeApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Layout } from 'antd';

const Task = () => {
    document.title = "Employee Task";
    const { id } = useParams();
    const [employee, setEmployee] = useState({});
    const navigate = useNavigatec();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await viewEmployeeByIdApi(id);
                setEmployee(response.data);  // Assuming response.data contains employee info


            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };
        fetchData();
    }, [id]);
    return (
        <Layout>
            <Breadcrumb
                items={[
                    { title: <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#000" }}>Home</span> },
                    { title: <span onClick={() => navigate("/employees")} style={{ cursor: "pointer", color: "#000" }}>Employees</span> },
                    { title: <span style={{ cursor: "pointer", color: "#3a3a3a" }}>Task</span> }
                ]}
                style={{ margin: "16px 0" }}
            />
            <Header employee={employee} />
            jh
        </Layout>
    )
}

export default Task
