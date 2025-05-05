import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  ApiOutlined,
  UserOutlined,
  BankOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AliwangwangOutlined,
  BugOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Dropdown,
  Space,
  message,
  Avatar,
  Button,
  theme,
} from "antd";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { callLogout } from "../../service/auth.api";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { MenuProps } from "antd";
import { setLogoutAction } from "../../redux/slice/account.slice";
import { ALL_PERMISSIONS } from "../../config/permissions";

const { Content, Sider } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [activeMenu, setActiveMenu] = useState("");
  const user = useAppSelector((state) => state.account.user);

  const permissions = useAppSelector((state) => state.account.user.permissions);
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (permissions?.length) {
      const viewCompany = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
      );

      const viewUser = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );

      const viewJob = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
      );

      const viewResume = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
      );

      const viewRole = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
      );

      const viewPermission = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );

      const full = [
        {
          label: <Link to="/admin">Dashboard</Link>,
          key: "/admin",
          icon: <AppstoreOutlined />,
        },
        ...(viewCompany
          ? [
              {
                label: <Link to="/admin/company">Company</Link>,
                key: "/admin/company",
                icon: <BankOutlined />,
              },
            ]
          : []),

        ...(viewUser
          ? [
              {
                label: <Link to="/admin/user">User</Link>,
                key: "/admin/user",
                icon: <UserOutlined />,
              },
            ]
          : []),
        ...(viewJob
          ? [
              {
                label: <Link to="/admin/job">Job</Link>,
                key: "/admin/job",
                icon: <ScheduleOutlined />,
              },
            ]
          : []),

        ...(viewResume
          ? [
              {
                label: <Link to="/admin/resume">Resume</Link>,
                key: "/admin/resume",
                icon: <AliwangwangOutlined />,
              },
            ]
          : []),
        ...(viewPermission
          ? [
              {
                label: <Link to="/admin/permission">Permission</Link>,
                key: "/admin/permission",
                icon: <ApiOutlined />,
              },
            ]
          : []),
        ...(viewRole
          ? [
              {
                label: <Link to="/admin/role">Role</Link>,
                key: "/admin/role",
                icon: <ExceptionOutlined />,
              },
            ]
          : []),
      ];

      setMenuItems(full);
    }
  }, [permissions]);
  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

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
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  return (
    <>
      <Layout style={{ minHeight: "100vh" }} className="layout-admin">
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ height: 32, margin: 16, textAlign: "center" }}>
            <BugOutlined /> ADMIN
          </div>
          <Menu
            selectedKeys={[activeMenu]}
            mode="inline"
            items={menuItems}
            onClick={(e) => setActiveMenu(e.key)}
          />
        </Sider>

        <Layout>
          <div
            className="admin-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: 20,
            }}
          >
            <Button
              type="text"
              icon={
                collapsed
                  ? React.createElement(MenuUnfoldOutlined)
                  : React.createElement(MenuFoldOutlined)
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                Welcome {user?.name}
                <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
              </Space>
            </Dropdown>
          </div>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminLayout;
