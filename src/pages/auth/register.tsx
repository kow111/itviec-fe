import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { callRegister } from "../../service/auth.api";
import { IUser } from "../../types/backend";
import TextArea from "antd/es/input/TextArea";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values: IUser) => {
    const { name, email, password, age, gender, address } = values;
    setIsSubmit(true);
    const res = await callRegister(
      name,
      email,
      password as string,
      +age,
      gender,
      address
    );
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };
  const optionGender = [
    { value: "female", label: "Nữ" },
    { value: "male", label: "Nam" },
    { value: "other", label: "Khác" },
  ];

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-md bg-white p-6 rounded-lg drop-shadow-lg">
        <h1 className="text-3xl font-bold text-center">Đăng Ký</h1>
        <Divider />
        <Form<IUser> layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email không được để trống!" }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[
                  { required: true, message: "Họ tên không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tuổi"
                name="age"
                rules={[
                  { required: true, message: "Tuổi không được để trống!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Giới tính không được để trống!" },
                ]}
              >
                <Select allowClear options={optionGender} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  { required: true, message: "Địa chỉ không được để trống!" },
                ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isSubmit}>
              Đăng ký
            </Button>
          </Form.Item>

          <Divider className="my-2">Hoặc</Divider>

          <p className="text-center">
            Đã có tài khoản?
            <Link to="/login" className="text-blue-500 ml-1">
              Đăng nhập
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
