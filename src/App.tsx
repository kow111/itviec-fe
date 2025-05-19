import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/auth/login";
import UserLayout from "./components/layouts/user.layout";
import HomePage from "./pages/home";
import RegisterPage from "./pages/auth/register";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { fetchAccount } from "./redux/slice/account.slice";
import AdminLayout from "./components/admin/admin.layout";
import CompanyPage from "./pages/admin/company";
import UserPage from "./pages/admin/user";
import PermissionPage from "./pages/admin/permission";
import RolePage from "./pages/admin/role";
import JobPage from "./pages/admin/job";
import ResumePage from "./pages/admin/resume";
import ClientCompanyDetailPage from "./pages/company/detail";
import ClientCompanyPage from "./pages/company";
import ClientJobPage from "./pages/job";
import ClientJobDetailPage from "./pages/job/detail";
import ScrollToTop from "./config/scroll.top";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    dispatch(fetchAccount());
    window.scrollTo(0, 0);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="company" element={<ClientCompanyPage />} />
          <Route path="company/:id" element={<ClientCompanyDetailPage />} />
          <Route path="job" element={<ClientJobPage />} />
          <Route path="job/:id" element={<ClientJobDetailPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<>Hello</>} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="permission" element={<PermissionPage />} />
          <Route path="role" element={<RolePage />} />
          <Route path="job" element={<JobPage />} />
          <Route path="resume" element={<ResumePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
