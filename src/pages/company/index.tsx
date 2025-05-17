import { Col, Row } from "antd";
import CompanyCard from "../../components/client/card/company.card";

const ClientCompanyPage = () => {
  return (
    <div style={{ marginTop: 20 }}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <CompanyCard showPagination={true} />
        </Col>
      </Row>
    </div>
  );
};

export default ClientCompanyPage;
