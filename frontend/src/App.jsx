import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import CreateTask from "./pages/admin/CreateTask";
import Dashboard from "./pages/admin/Dashboard";
import ManageTask from "./pages/admin/ManageTask";
import ManageUsers from "./pages/admin/ManageUsers";
import PrivateRoute from "./routes/PrivateRoute";
import UserDashboard from "./pages/user/UserDashboard";
import MyTasks from "./pages/user/MyTasks";
import TaskDetails from "./pages/user/TaskDetails";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/*Admin Route*/}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTask />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
          </Route>

          {/*Admin Route*/}
          <Route element={<PrivateRoute allowedRoles={["users"]} />}></Route>

          <Route path="/users/dashboard" element={<UserDashboard />} />
          <Route path="/users/tasks" element={<MyTasks />} />
          <Route path="/users/task-details/:id" element={<TaskDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
