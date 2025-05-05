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

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    dispatch(fetchAccount());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<>Hello</>} />
          <Route path="company" element={<CompanyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
