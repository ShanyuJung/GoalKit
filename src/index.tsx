import ReactDOM from "react-dom/client";
import {
  Navigate,
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import Chart from "./pages/Chart/Chart";
import Dashboard from "./pages/User/Dashboard";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Project, { checkPermissionHandler } from "./pages/Project/Project";
import Signup from "./pages/Signup/Signup";
import Workspace, { getProjectsHandler } from "./pages/Workspace/Workspace";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route
        path="workspace/:workspaceID"
        element={<Workspace />}
        loader={getProjectsHandler}
      />
      <Route
        path="workspace/:workspaceID/project/:projectID"
        element={<Project />}
        loader={checkPermissionHandler}
      />
      <Route
        path="workspace/:workspaceID/project/:projectID/card/:cardID"
        element={<Project />}
        loader={checkPermissionHandler}
      />
      <Route
        path="workspace/:workspaceID/project/:projectID/chart/:chartType"
        element={<Chart />}
        loader={checkPermissionHandler}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
