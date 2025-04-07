import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './routes/defualt/Dashboard';
import Login from './routes/defualt/Login';
import ProtectedRoute from './components/layouts/ProtectedRoute';
import Users from './routes/user/users';
import ErrorPage from './components/layouts/ErrorPage';
import Role from './routes/role/Role';
import Employees from './routes/employee/Employee';
import Designations from './routes/designation/Designations';
import Departments from './routes/department/Departments';
import { useEffect, useState } from 'react';
import ViewEmployee from './routes/employee/ViewEmployee';
import Task from './routes/employee/Task';
import Project from './routes/project/Project';
import Category from './routes/category/Category';
import Skills from './routes/skill/Skills';
import JobApplication from './routes/job-application/JobApplication';
import SubCategory from './routes/sub-category/SubCategory';
import Jobs from './routes/job/Jobs';
import Round from './routes/round/Round';
import InterviewSchedule from './routes/interview-schedule/InterviewSchedule';
import NotAllow from './components/layouts/NotAllow';
import JobPositions from './routes/job-position/JobPositions';
import PDFGenerator from './routes/reprots/job/JobReport';

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
