import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { ICompany } from "../../types/backend";
import { callFetchCompanyById } from "../../service/company.api";
import parse from "html-react-parser";
import { Avatar, Col, Divider, Row, Skeleton, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import JobCard from "../../components/client/card/job.card";

const ClientCompanyDetailPage = () => {
  const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchCompanyById(id);
        if (res?.data) {
          setCompanyDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Row gutter={[20, 20]}>
          {companyDetail && companyDetail._id && (
            <>
              <Col span={24} md={16}>
                <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200">
                  <Typography.Title level={2}>
                    {companyDetail.name}
                  </Typography.Title>

                  <div className="flex items-center text-gray-600 mb-4">
                    <EnvironmentOutlined className="text-teal-500 mr-2" />
                    <span>{companyDetail?.address}</span>
                  </div>

                  <Divider />

                  <div className="">
                    {parse(companyDetail?.description ?? "")}
                  </div>
                </div>
              </Col>

              <Col span={24} md={8}>
                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="flex flex-col items-center ">
                    <Avatar
                      src={companyDetail?.logo}
                      size={200}
                      className="mb-4"
                      shape="square"
                    />
                    <h2 className="text-lg font-semibold text-gray-800">
                      {companyDetail?.name}
                    </h2>
                  </div>
                  <JobCard
                    company={companyDetail._id}
                    showPagination={false}
                    type="company"
                  />
                </div>
              </Col>
            </>
          )}
        </Row>
      )}
    </div>
  );
};

export default ClientCompanyDetailPage;
