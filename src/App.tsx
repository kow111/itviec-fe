import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/auth/login";
import UserLayout from "./components/layouts/user.layout";
import HomePage from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
