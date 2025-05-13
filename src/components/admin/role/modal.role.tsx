import {
  Card,
  Col,
  Collapse,
  CollapseProps,
  Form,
  Input,
  Modal,
  Row,
  Switch,
  Tooltip,
  message,
  notification,
} from "antd";
import { callCreateRole, callUpdateRole } from "../../../service/role.api";
import { callFetchPermission } from "../../../service/permission.api";
import { IPermission } from "../../../types/backend";
import { useState, useEffect } from "react";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { resetSingleRole } from "../../../redux/slice/role.slice";
import { colorMethod } from "../../../config/utils";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reloadTable: () => void;
}

const ModalRole = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable } = props;
  const singleRole = useAppSelector((state) => state.role.singleRole);

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [listPermissions, setListPermissions] = useState<
    | {
        module: string;
        permissions: IPermission[];
      }[]
    | null
  >(null);

  const groupByPermission = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissions: value as IPermission[] };
      })
      .value();
  };

  useEffect(() => {
    const init = async () => {
      const res = await callFetchPermission(`current=1&pageSize=100`);
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result));
      }
    };
    init();
  }, []);

  useEffect(() => {
    console.log("listPermissions", listPermissions);
  }, [listPermissions]);

  useEffect(() => {
    if (listPermissions?.length && singleRole?._id) {
      form.setFieldsValue({
        name: singleRole.name,
        isActive: singleRole.isActive,
        description: singleRole.description,
      });
      const userPermissions = groupByPermission(singleRole.permissions);

      listPermissions.forEach((x) => {
        x.permissions?.forEach((y) => {
          const temp = userPermissions.find((z) => z.module === x.module);

          if (temp) {
            const isExist = temp.permissions.find((k) => k._id === y._id);
            if (isExist) {
              form.setFieldValue(["permissions", y._id as string], true);
            }
          }
        });
      });
    }
  }, [listPermissions, singleRole]);

  const submitRole = async (valuesForm: any) => {
    const { description, isActive, name, permissions } = valuesForm;
    const checkedPermissions = [];

    if (permissions) {
      for (const key in permissions) {
        if (key.match(/^[0-9a-fA-F]{24}$/) && permissions[key] === true) {
          checkedPermissions.push(key);
        }
      }
    }

    if (singleRole?._id) {
      //update
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      const res = await callUpdateRole(role, singleRole._id);
      if (res.data) {
        message.success("Cập nhật role thành công");
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
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      const res = await callCreateRole(role);
      if (res.data) {
        message.success("Thêm mới role thành công");
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
    setOpenModal(false);
    dispatch(resetSingleRole({}));
  };

  const items: CollapseProps["items"] = listPermissions?.map((item, index) => ({
    key: index,
    label: <div>{item.module}</div>,
    children: (
      <Row gutter={[16, 16]}>
        {item.permissions?.map((value, i: number) => (
          <Col lg={12} md={12} sm={24} key={i}>
            <Card
              size="small"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Form.Item name={["permissions", value._id as string]}>
                  <Switch defaultChecked={false} />
                </Form.Item>
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Tooltip title={value?.name}>
                  <p
                    style={{
                      paddingLeft: 10,
                      marginBottom: 3,
                    }}
                  >
                    {value?.name || ""}
                  </p>

                  <div style={{ display: "flex" }}>
                    <p
                      style={{
                        paddingLeft: 10,
                        fontWeight: "bold",
                        marginBottom: 0,
                        color: colorMethod(value?.method as string),
                      }}
                    >
                      {value?.method || ""}
                    </p>

                    <p
                      style={{
                        paddingLeft: 10,
                        marginBottom: 0,
                        color: "#bfbfbf", // tương đương grey[5]
                      }}
                    >
                      {value?.apiPath || ""}
                    </p>
                  </div>
                </Tooltip>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    ),
  }));

  return (
    <>
      <Modal
        title={<>{singleRole?._id ? "Cập nhật Role" : "Tạo mới Role"}</>}
        open={openModal}
        width={1000}
        onOk={form.submit}
        onCancel={handleReset}
      >
        <Form
          form={form}
          layout="vertical"
          name="permission"
          onFinish={submitRole}
        >
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Tên Role"
                name="name"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <Input placeholder="Nhập tên role" />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Trạng thái" name="isActive" initialValue={true}>
                <Switch defaultChecked={false} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Miêu tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <Input.TextArea
                  placeholder="Nhập miêu tả role"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Card title="Quyền hạn" size="small" bordered>
                <Collapse items={items} />
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalRole;
