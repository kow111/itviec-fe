import SearchClient from "../../components/client/user.seatch";
import { Col, Divider, Row } from "antd";
import JobCard from "../../components/client/card/job.card";

const ClientJobPage = (props: any) => {
  return (
    <div style={{ marginTop: 20 }}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <SearchClient />
        </Col>
        <Divider />

        <Col span={24}>
          <JobCard showPagination={true} />
        </Col>
      </Row>
    </div>
  );
};

export default ClientJobPage;
