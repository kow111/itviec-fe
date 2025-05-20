import { useState, useEffect } from "react";
import {
  CodeOutlined,
  ContactsOutlined,
  DashOutlined,
  LogoutOutlined,
  RiseOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { App, Avatar, Dropdown, MenuProps, Space } from "antd";
import { Menu } from "antd";
import { useLocation, useNavigate, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { callLogout } from "../../service/auth.api";
import { setLogoutAction } from "../../redux/slice/account.slice";
import { Header } from "antd/es/layout/layout";
import ManageAccount from "./modal/manage.account";
// import ManageAccount from './modal/manage.account';

const UserHeader = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);

  const [current, setCurrent] = useState("");
  const location = useLocation();

  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const items: MenuProps["items"] = [
    {
      label: <Link to={"/"}>Trang Chủ</Link>,
      key: "/",
      icon: <TwitterOutlined />,
    },
    {
      label: <Link to={"/job"}>Việc Làm IT</Link>,
      key: "/job",
      icon: <CodeOutlined />,
    },
    {
      label: <Link to={"/company"}>Top Công ty IT</Link>,
      key: "/company",
      icon: <RiseOutlined />,
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(setLogoutAction({}));
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const itemsDropdown = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    {
      label: <Link to={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="text-3xl text-blue-500 font-bold cursor-pointer me-4">
        <h1
          className="text-2xl font-bold text-white mb-2"
          onClick={() => navigate("/")}
        >
          JobFinder<span className="text-blue-500">.pro</span>
        </h1>
      </div>
      <div className="flex items-center justify-between w-full">
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          theme="dark"
          mode="horizontal"
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <span className="text-gray-200">Welcome {user?.name}</span>
                <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
              </Space>
            </Dropdown>
          ) : (
            <Link to={"/login"}>Đăng Nhập</Link>
          )}
        </div>
      </div>
      <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
    </Header>
  );
};

export default UserHeader;
