import {
  App,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
} from "antd";
import { IJob } from "../../../types/backend";
import { useEffect, useState } from "react";
import { callCreateJob, callUpdateJob } from "../../../service/job.api";
import dayjs from "dayjs";
import { LEVEL_LIST, LOCATION_LIST, SKILLS_LIST } from "../../../config/utils";
import { callFetchCompany } from "../../../service/company.api";
import { ICompanySelect } from "../user/modal.user";
import ReactQuill from "react-quill";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: IJob | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

const ModalJob = (props: IProps) => {
  const { message, notification } = App.useApp();
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [value, setValue] = useState<string>("");
  const [companies, setCompanies] = useState<ICompanySelect[]>([]);
  const submitJob = async (values: any) => {
    if (dataInit?._id) {
      const job = {
        name: values.name,
        skills: values.skills,
        company: values.company,
        location: values.location,
        salary: values.salary,
        quantity: values.quantity,
        level: values.level,
        description: value,
        startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate)
          ? dayjs(values.startDate, "DD/MM/YYYY").toDate()
          : values.startDate,
        endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate)
          ? dayjs(values.endDate, "DD/MM/YYYY").toDate()
          : values.endDate,
        isActive: values.isActive,
      };

      const res = await callUpdateJob(job, dataInit._id);
      if (res.data) {
        message.success("Cập nhật job thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      const job = {
        name: values.name,
        skills: values.skills,
        company: values.company,
        location: values.location,
        salary: values.salary,
        quantity: values.quantity,
        level: values.level,
        description: value,
        startDate: dayjs(values.startDate, "DD/MM/YYYY").toDate(),
        endDate: dayjs(values.endDate, "DD/MM/YYYY").toDate(),
        isActive: values.isActive,
      };

      const res = await callCreateJob(job);
      if (res.data) {
        message.success("Tạo mới job thành công");
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

  useEffect(() => {
    if (!openModal) return;
    fetchCompanyList();
  }, [openModal]);

  useEffect(() => {
    if (dataInit?._id) {
      form.setFieldsValue({
        name: dataInit.name,
        skills: dataInit.skills,
        location: dataInit.location,
        salary: dataInit.salary,
        quantity: dataInit.quantity,
        level: dataInit.level,
        company: dataInit.company?._id,
        startDate: dayjs(dataInit.startDate),
        endDate: dayjs(dataInit.endDate),
        isActive: dataInit.isActive,
      });
      setValue(dataInit.description || "");
    } else {
      form.resetFields();
      setValue("");
    }
  }, [dataInit]);

  return (
    <>
      <Modal
        title={
          <>{dataInit?._id ? "Cập nhật Permission" : "Tạo mới Permission"}</>
        }
        open={openModal}
        width={1200}
        onOk={form.submit}
        onCancel={handleReset}
      >
        <Form
          name="layout-multiple-horizontal"
          layout="vertical"
          form={form}
          onFinish={submitJob}
        >
          <Row gutter={[20, 20]}>
            <Col span={24} md={12}>
              <Form.Item
                label="Tên Job"
                name="name"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <Input placeholder="Nhập tên job" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item
                name="skills"
                label="Kỹ năng yêu cầu"
                rules={[{ required: true, message: "Vui lòng chọn kỹ năng!" }]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Please select a skill"
                  options={SKILLS_LIST}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item
                name="location"
                label="Địa điểm"
                rules={[{ required: true, message: "Vui lòng chọn địa điểm!" }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Please select a location"
                  options={LOCATION_LIST}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item
                label="Mức lương"
                name="salary"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <InputNumber
                  placeholder="Nhập mức lương"
                  addonAfter=" đ"
                  formatter={(value) => {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }}
                  parser={(value) => {
                    return +(value || "").replace(/\$\s?|(,*)/g, "");
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              >
                <InputNumber placeholder="Nhập số lượng" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item
                name="level"
                label="Trình độ"
                rules={[{ required: true, message: "Vui lòng chọn level!" }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Please select a level"
                  options={LEVEL_LIST}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item
                name="company"
                label="Thuộc Công Ty"
                rules={[{ required: true, message: "Vui lòng chọn company!" }]}
              >
                <Select
                  allowClear
                  showSearch
                  options={companies}
                  placeholder="Chọn công ty"
                />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item label="Trạng thái" name="isActive">
                <Switch defaultChecked={false} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalJob;
