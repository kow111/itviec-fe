import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import {
  callCreateCompany,
  callUpdateCompany,
} from "../../../service/company.api";
import { ICompany } from "../../../types/backend";
import { v4 as uuidv4 } from "uuid";
import { callUploadSingleFile } from "../../../service/upload.api";
import TextArea from "antd/es/input/TextArea";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: ICompany | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

interface ICompanyForm {
  name: string;
  address: string;
}

interface ICompanyLogo {
  name: string;
  uid: string;
}

const ModalCompany = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [dataLogo, setDataLogo] = useState<ICompanyLogo[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [value, setValue] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataInit?._id && dataInit?.description) {
      setValue(dataInit.description);
    }
  }, [dataInit]);

  const submitCompany = async (valuesForm: ICompanyForm) => {
    const { name, address } = valuesForm;

    if (dataLogo.length === 0) {
      message.error("Vui lòng upload ảnh Logo");
      return;
    }

    if (dataInit?._id) {
      //update
      const res = await callUpdateCompany(
        dataInit._id,
        name,
        address,
        value,
        dataLogo[0].name
      );
      if (res.data) {
        message.success("Cập nhật company thành công");
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
      const res = await callCreateCompany(
        name,
        address,
        value,
        dataLogo[0].name
      );
      if (res.data) {
        message.success("Thêm mới company thành công");
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
    setValue("");
    setDataInit(null);
    setOpenModal(false);
  };

  const handleRemoveFile = () => {
    setDataLogo([]);
  };

  const handlePreview = async (file: any) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url: string) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
    }
    if (info.file.status === "done") {
      setLoadingUpload(false);
    }
    if (info.file.status === "error") {
      setLoadingUpload(false);
      message.error(
        info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file."
      );
    }
  };

  const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
    const res = await callUploadSingleFile(file, "company");
    if (res && res.data) {
      setDataLogo([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      if (onSuccess) onSuccess("ok");
    } else {
      if (onError) {
        setDataLogo([]);
        const error = new Error(res.message);
        onError({ event: error });
      }
    }
  };

  useEffect(() => {
    if (dataInit?._id) {
      form.setFieldsValue({
        name: dataInit.name,
        address: dataInit.address,
      });
      setValue(dataInit.description || "");
      setDataLogo(
        dataInit.logo
          ? [
              {
                name: dataInit.logo,
                uid: uuidv4(),
              },
            ]
          : []
      );
    } else {
      form.resetFields();
      setValue("");
      setDataLogo([]);
    }
  }, [dataInit]);

  return (
    <>
      {openModal && (
        <>
          <Modal
            title={
              <>{dataInit?._id ? "Cập nhật Company" : "Tạo mới Company"}</>
            }
            open={openModal}
            width={800}
            onOk={form.submit}
            onCancel={handleReset}
          >
            <Form
              name="layout-multiple-horizontal"
              layout="vertical"
              form={form}
              onFinish={submitCompany}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Tên công ty"
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng không bỏ trống" },
                    ]}
                  >
                    <Input placeholder="Tên công ty" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Ảnh Logo"
                    name="logo"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng không bỏ trống",
                        validator: () => {
                          if (dataLogo.length > 0) return Promise.resolve();
                          else return Promise.reject(false);
                        },
                      },
                    ]}
                  >
                    <Upload
                      name="logo"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileLogo}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={handleRemoveFile}
                      onPreview={handlePreview}
                      defaultFileList={
                        dataInit?._id
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.logo ?? "",
                                status: "done",
                                url: dataInit?.logo,
                              },
                            ]
                          : []
                      }
                    >
                      <div>
                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>

                <Col span={16}>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Địa chỉ không được để trống!",
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <ReactQuill theme="snow" value={value} onChange={setValue} />
                </Col>
              </Row>
            </Form>
          </Modal>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            style={{ zIndex: 1500 }}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalCompany;
