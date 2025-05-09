import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
  notification,
} from "antd";
import {
  callCreatePermission,
  callUpdatePermission,
} from "../../../service/permission.api";
import { IPermission } from "../../../types/backend";
import { ALL_MODULES } from "../../../config/permissions";
import { useEffect } from "react";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: IPermission | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

const ModalPermission = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
  const [form] = Form.useForm();

  const submitPermission = async (valuesForm: any) => {
    const { name, apiPath, method, module } = valuesForm;
    if (dataInit?._id) {
      //update
      const permission = {
        name,
        apiPath,
        method,
        module,
      };

      const res = await callUpdatePermission(permission, dataInit._id);
      if (res.data) {
        message.success("Cập nhật permission thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const permission = {
        name,
        apiPath,
        method,
        module,
      };
      const res = await callCreatePermission(permission);
      if (res.data) {
        message.success("Thêm mới permission thành công");
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
    form.resetFields();
    setDataInit(null);
    setOpenModal(false);
  };

  useEffect(() => {
    if (dataInit?._id) {
      form.setFieldsValue({
        name: dataInit.name,
        apiPath: dataInit.apiPath,
        method: dataInit.method,
        module: dataInit.module,
      });
    } else {
      form.resetFields();
    }
  }, [dataInit]);

  return (
    <>
      <Modal
        title={
          <>{dataInit?._id ? "Cập nhật Permission" : "Tạo mới Permission"}</>
        }
        open={openModal}
        width={800}
        onOk={form.submit}
        onCancel={handleReset}
      >
        <Form
          form={form}
          layout="vertical"
          name="permission"
          onFinish={submitPermission}
        >
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Tên Permission"
                name="name"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <Input placeholder="Nhập tên permission" />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="API Path"
                name="apiPath"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <Input placeholder="Nhập api path" />
              </Form.Item>
            </Col>

            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Method"
                name="method"
                rules={[{ required: true, message: "Vui lòng chọn method!" }]}
              >
                <Select
                  placeholder="Chọn method"
                  options={[
                    { label: "GET", value: "GET" },
                    { label: "POST", value: "POST" },
                    { label: "PUT", value: "PUT" },
                    { label: "DELETE", value: "DELETE" },
                    { label: "PATCH", value: "PATCH" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="module"
                label="Thuộc Module"
                rules={[{ required: true, message: "Vui lòng chọn module!" }]}
              >
                <Select
                  placeholder="Chọn module"
                  options={Object.keys(ALL_MODULES).map((key) => ({
                    label: ALL_MODULES[key as keyof typeof ALL_MODULES],
                    value: key,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalPermission;
