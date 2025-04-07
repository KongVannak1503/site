import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState({});
    const token = localStorage.getItem('token');
    const location = useLocation();
    if (!token) {
        window.location.href = '/login';
    }
    useEffect(() => {
        try {
            if (!token) {
                return window.location.href = '/login';
            }
            const decodedToken = jwt_decode(token);

            const expirationTime = decodedToken.exp * 1000;
            if (expirationTime < Date.now()) {
                localStorage.removeItem('token');
                setPermissions({});
                return;
            }

            setPermissions(decodedToken.permissions || {});
        } catch (error) {
            console.error("Token decoding failed:", error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }


    const permissionRoutes = Object.keys(permissions);
    const route = location.pathname;

    // Ensure the route exists in permissions and has at least one action
    const hasPermission = permissionRoutes.some((perm) =>
        route.startsWith(perm) && permissions[perm]?.includes("read")
    );

    if (!hasPermission) {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};

export default ProtectedRoute;
