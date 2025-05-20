import SearchClient from "../../components/client/user.search";
import { Col, Divider, Row } from "antd";
import JobCard from "../../components/client/card/job.card";
import { useLocation } from "react-router";

const ClientJobPage = (props: any) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const skillParams = queryParams.get("skills");
  const locationParam = queryParams.get("location");
  return (
    <div style={{ marginTop: 20 }}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <SearchClient />
        </Col>
        <Divider />

        <Col span={24}>
          <JobCard
            showPagination={true}
            keyword={skillParams}
            location={locationParam}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ClientJobPage;
