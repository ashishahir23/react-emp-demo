import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/Header";
import LoginForm from '../pages/Login/LoginForm';
import EmployeeList from '../pages/employee/EmployeeList';
import EmployeeForm from '../pages/employee/EmployeeForm';
import DepartmentList from '../pages/department/DepartmentList';
import DepartmentForm from '../pages/department/DepartmentForm';

const AppRoutes = () => {

    // Layout for authenticated pages
    const ProtectedLayout = () => (
        <>
            <Header />
            <main style={{ padding: "6px", width: "99%", minHeight: "750px" }}>
                <Outlet />
            </main>
        </>
    );

    return (
        <>
            <AuthProvider>                
                <HashRouter>
                    <Routes>
                        {/* public route */}
                        <Route path="/Login" element={<LoginForm />} />

                        {/* protected / private routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<ProtectedLayout />}>
                                <Route path="/department/list" element={<DepartmentList />} />
                                <Route path="/department/add" element={<DepartmentForm />} />
                                <Route path="/department/edit/:id" element={<DepartmentForm />} />
                                <Route path="/employee/list" element={<EmployeeList />} />                                
                                <Route path="/employee/add" element={<EmployeeForm />} />
                                <Route path="/employee/edit/:id" element={<EmployeeForm />} />
                            </Route>
                        </Route>

                        {/* fallback: redirect any unknown route */}
                        <Route path="*" element={<LoginForm />} />
                    </Routes>                
                </HashRouter>
            </AuthProvider>
        </>
    );
}

export default AppRoutes;