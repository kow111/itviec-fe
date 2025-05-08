import { App, Col, Form, Input, Modal, Row, Select } from "antd";
import { useState, useEffect } from "react";
import { IUser } from "../../../types/backend";
import { callCreateUser, callUpdateUser } from "../../../service/user.api";
import { callFetchCompany } from "../../../service/company.api";
import { callFetchRole } from "../../../service/role.api";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: IUser | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

export interface ICompanySelect {
  label: string;
  value: string;
  key?: string;
}

const ModalUser = (props: IProps) => {
  const { message, notification } = App.useApp();
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
  const [companies, setCompanies] = useState<ICompanySelect[]>([]);
  const [roles, setRoles] = useState<ICompanySelect[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (dataInit?._id) {
      form.setFieldsValue({
        name: dataInit.name,
        email: dataInit.email,
        password: dataInit.password,
        age: dataInit.age,
        gender: dataInit.gender,
        address: dataInit.address,
      });
      if (dataInit.company) {
        form.setFieldsValue({
          company: dataInit.company?._id,
        });
      }
      if (dataInit.role) {
        form.setFieldsValue({
          role: dataInit.role?._id,
        });
      }
    } else {
      form.resetFields();
    }
  }, [dataInit]);

  const submitUser = async (valuesForm: any) => {
    const { name, email, password, address, age, gender, role, company } =
      valuesForm;
    console.log(valuesForm);
    if (dataInit?._id) {
      const user = {
        name,
        email,
        password,
        age,
        gender,
        address,
        role: role,
        company: company,
      };

      const res = await callUpdateUser(user, dataInit._id);
      if (res.data) {
        message.success("Cập nhật user thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      const user = {
        name,
        email,
        password,
        age,
        gender,
        address,
        role: role,
        company: company,
      };
      const res = await callCreateUser(user);
      if (res.data) {
        message.success("Thêm mới user thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const handleReset = async () => {
    setOpenModal(false);
    form.resetFields();
    setDataInit(null);
  };

  const fetchCompanyList = async () => {
    const res = await callFetchCompany(`current=1&pageSize=100`);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string,
        };
      });
      setCompanies(temp);
    } else return [];
  };

  const fetchRoleList = async () => {
    const res = await callFetchRole(`current=1&pageSize=100`);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string,
        };
      });
      setRoles(temp);
    } else return [];
  };

  useEffect(() => {
    if (!openModal) return;
    fetchRoleList();
    fetchCompanyList();
  }, [openModal]);

  return (
    <>
      <Modal
        title={<>{dataInit?._id ? "Cập nhật User" : "Tạo mới User"}</>}
        open={openModal}
        width={800}
        onOk={form.submit}
        onCancel={handleReset}
      >
        <Form
          name="layout-multiple-horizontal"
          layout="vertical"
          form={form}
          onFinish={submitUser}
        >
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng không bỏ trống" },
                  { type: "email", message: "Vui lòng nhập email hợp lệ" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: dataInit?._id ? false : true,
                    message: "Vui lòng không bỏ trống",
                  },
                  {
                    min: 6,
                    message: "Password phải có ít nhất 6 ký tự",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Nhập password"
                  disabled={dataInit?._id ? true : false}
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                label="Tên hiển thị"
                name="name"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <Input placeholder="Nhập tên hiển thị" />
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                label="Tuổi"
                name="age"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <Input placeholder="Nhập tuổi" type="number" />
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                name="gender"
                label="Giới Tính"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  options={[
                    { label: "Nam", value: "MALE" },
                    { label: "Nữ", value: "FEMALE" },
                    { label: "Khác", value: "OTHER" },
                  ]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Chọn vai trò"
                  options={roles}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="company"
                label="Thuộc Công Ty"
                rules={[{ required: true, message: "Vui lòng chọn công ty!" }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Chọn công ty"
                  options={companies}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <Input.TextArea
                  placeholder="Nhập địa chỉ"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalUser;
