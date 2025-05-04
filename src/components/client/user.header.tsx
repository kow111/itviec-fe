import { useState, useEffect } from "react";
import {
  CodeOutlined,
  ContactsOutlined,
  DashOutlined,
  LogoutOutlined,
  RiseOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from "antd";
import { Menu, ConfigProvider } from "antd";
import { FaReact } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { callLogout } from "../../service/auth.api";
import { setLogoutAction } from "../../redux/slice/account.slice";
// import ManageAccount from './modal/manage.account';

const UserHeader = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const [current, setCurrent] = useState("home");
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

  const itemsMobiles = [...items, ...itemsDropdown];

  return (
    <>
      <div>
        <div>
          <div style={{ display: "flex", gap: 30 }}>
            <div>
              <FaReact onClick={() => navigate("/")} title="ITviec" />
            </div>
            <div>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#fff",
                    colorBgContainer: "#222831",
                    colorText: "#a7a7a7",
                  },
                }}
              >
                <Menu
                  // onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={items}
                />
              </ConfigProvider>
              <div>
                {isAuthenticated === false ? (
                  <Link to={"/login"}>Đăng Nhập</Link>
                ) : (
                  <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
                    <Space style={{ cursor: "pointer" }}>
                      <span>Welcome {user?.name}</span>
                      <Avatar>
                        {" "}
                        {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                      </Avatar>
                    </Space>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        title="Chức năng"
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={itemsMobiles}
        />
      </Drawer>
      {/* <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            /> */}
    </>
  );
};

export default UserHeader;
