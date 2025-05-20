import { Button, Col, Form, Row, Select } from "antd";
import { EnvironmentOutlined, MonitorOutlined } from "@ant-design/icons";
import { LOCATION_LIST, SKILLS_LIST } from "../../config/utils";
import { useNavigate } from "react-router";

interface IProps {
  defaultSkills?: string[] | null;
  defaultLocations?: string[] | null;
}

const SearchClient = (props: IProps) => {
  const { defaultSkills, defaultLocations } = props;
  const navigate = useNavigate();
  const optionsSkills = SKILLS_LIST;
  const optionsLocations = LOCATION_LIST;
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const { skills, location } = values;
    const queryParams = new URLSearchParams();
    if (skills) {
      queryParams.append("skills", skills.join(","));
    }
    if (location) {
      queryParams.append("location", location.join(","));
    }
    const queryString = queryParams.toString();
    navigate(`/job?${queryString}`);
  };

  return (
    <div className="p-4 ">
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          skills: defaultSkills,
          location: defaultLocations,
        }}
      >
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <h2 className="text-2xl font-bold">
              Việc Làm IT Cho Developer "Chất"
            </h2>
          </Col>
          <Col span={24} md={16}>
            <Form.Item name="skills">
              <Select
                mode="multiple"
                allowClear
                showArrow={false}
                style={{ width: "100%" }}
                placeholder={
                  <>
                    <MonitorOutlined /> Tìm theo kỹ năng...
                  </>
                }
                optionLabelProp="label"
                options={optionsSkills}
              />
            </Form.Item>
          </Col>
          <Col span={12} md={4}>
            <Form.Item name="location">
              <Select
                mode="multiple"
                allowClear
                showArrow={false}
                style={{ width: "100%" }}
                placeholder={
                  <>
                    <EnvironmentOutlined /> Địa điểm...
                  </>
                }
                optionLabelProp="label"
                options={optionsLocations}
              />
            </Form.Item>
          </Col>
          <Col span={12} md={4}>
            <Button type="primary" onClick={() => form.submit()}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default SearchClient;
