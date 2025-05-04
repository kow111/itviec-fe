import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/auth/login";
import UserLayout from "./components/layouts/user.layout";
import HomePage from "./pages/home";
import RegisterPage from "./pages/auth/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
