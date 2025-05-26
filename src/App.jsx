import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './routes/defualt/Dashboard';
import Login from './routes/defualt/Login';
import ProtectedRoute from './components/layouts/ProtectedRoute';
import ErrorPage from './components/layouts/ErrorPage';
import { useEffect, useState } from 'react';
import NotAllow from './components/layouts/NotAllow';
import PDFGenerator from './routes/reprots/job/JobReport';
import InterviewSchedule from './routes/recruiting/interview-schedule/InterviewSchedule';
import Jobs from './routes/recruiting/job/Jobs';
import JobApplication from './routes/recruiting/job-application/JobApplication';
import JobPositions from './routes/recruiting/job-position/JobPositions';
import Users from './routes/setting/user/Users';
import Role from './routes/setting/role/Role';
import Employees from './routes/employees/employee/Employee';
import ViewEmployee from './routes/employees/employee/ViewEmployee';
import Task from './routes/employees/employee/Task';
import Designations from './routes/setting/designation/Designations';
import Departments from './routes/setting/department/Departments';
import Category from './routes/setting/category/Category';
import SubCategory from './routes/setting/sub-category/SubCategory';
import Project from './routes/project/Project';
import Skills from './routes/setting/skill/Skills';
import Round from './routes/setting/round/Round';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token'); // or sessionStorage, depending on where you store the token
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<MainLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="roles"
            element={
              <ProtectedRoute>
                <Role />
              </ProtectedRoute>
            }
          />

          <Route
            path="employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees/view/:id"
            element={
              <ProtectedRoute>
                <ViewEmployee />
              </ProtectedRoute>
            }
          />

          <Route
            path="employees/task/:id"
            element={
              <ProtectedRoute>
                <Task />
              </ProtectedRoute>
            }
          />

          <Route
            path="designations"
            element={
              <ProtectedRoute>
                <Designations />
              </ProtectedRoute>
            }
          />

          <Route
            path="departments"
            element={
              <ProtectedRoute>
                <Departments />
              </ProtectedRoute>
            }
          />

          <Route
            path="category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />

          <Route
            path="sub-category"
            element={
              <ProtectedRoute>
                <SubCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="projects"
            element={
              <ProtectedRoute>
                <Project />
              </ProtectedRoute>
            }
          />

          <Route
            path="skills"
            element={
              <ProtectedRoute>
                <Skills />
              </ProtectedRoute>
            }
          />

          <Route
            path="job-application"
            element={
              <ProtectedRoute>
                <JobApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="interview-schedule"
            element={
              <ProtectedRoute>
                <InterviewSchedule />
              </ProtectedRoute>
            }
          />

          <Route
            path="round"
            element={
              <ProtectedRoute>
                <Round />
              </ProtectedRoute>
            }
          />

          <Route
            path="job-positions"
            element={
              <ProtectedRoute>
                <JobPositions />
              </ProtectedRoute>
            }
          />

          <Route
            path="reports"
            element={
              <ProtectedRoute>
                <PDFGenerator />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="access-denied" element={<NotAllow />} />

        {/* Catch-all route for undefined pages */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
