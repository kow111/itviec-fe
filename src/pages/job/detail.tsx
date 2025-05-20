import { useState, useEffect } from "react";
import { IJob } from "../../types/backend";
import { callFetchJobById } from "../../service/job.api";
import parse from "html-react-parser";
import { Avatar, Col, Divider, Row, Skeleton, Tag } from "antd";
import {
  DollarOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { getLocationName } from "../../config/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import ApplyModal from "@/components/client/modal/apply.modal";
import { useNavigate, useParams } from "react-router";
import ApplyModal from "../../components/client/modal/apply.modal";
import { useAppSelector } from "../../redux/hooks";
import JobCard from "../../components/client/card/job.card";
dayjs.extend(relativeTime);

const ClientJobDetailPage = (props: any) => {
  const navigate = useNavigate();
  const [jobDetail, setJobDetail] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );

  const { id } = useParams();

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchJobById(id);
        if (res?.data) {
          setJobDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);
  const truncateContent = (content: string, length = 50) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    const textContent = doc.body.textContent || doc.body.innerText;

    return textContent.length > length
      ? textContent.substring(0, length) + "..."
      : textContent;
  };
  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Row gutter={[20, 20]} className="my-10">
          {jobDetail && jobDetail._id && (
            <>
              <Col span={24} md={16}>
                <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200">
                  <div className="sticky top-16 bg-white z-10 pb-1 pt-2">
                    <div className="text-3xl font-bold mb-4">
                      {jobDetail.name}
                    </div>

                    <div className="text-gray-800 mb-4 text-lg">
                      {jobDetail?.company?.name}
                    </div>
                    <div className="mb-2 text-blue-700 text-xl flex items-center">
                      <DollarOutlined className="text-green-500" />
                      {isAuthenticated ? (
                        <>
                          <span className="ml-2 font-medium">
                            {(jobDetail.salary + "").replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            )}{" "}
                            đ
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className="ml-2 font-medium cursor-pointer underline"
                            onClick={() => navigate("/login")}
                          >
                            Sign in to view salary
                          </span>
                        </>
                      )}
                    </div>
                    <div className="mb-4">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-md bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded shadow w-full cursor-pointer transition duration-200 ease-in-out"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>

                  <Divider />

                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-gray-500">Skills:</span>
                    {jobDetail?.skills?.map((item, index) => (
                      <Tag key={`${index}-key`} color="gold">
                        {item}
                      </Tag>
                    ))}
                  </div>

                  <div className="mb-2 text-gray-700 flex items-center">
                    <EnvironmentOutlined className="text-teal-500" />
                    <span className="ml-2">
                      {getLocationName(jobDetail.location)}
                    </span>
                  </div>

                  <div className="mb-4 text-gray-500 flex items-center">
                    <HistoryOutlined />
                    <span className="ml-2">
                      {dayjs(jobDetail.updatedAt).fromNow()}
                    </span>
                  </div>
                  <Divider />
                  <div className="prose max-w-none">
                    {parse(jobDetail.description)}
                  </div>
                </div>
                <JobCard showPagination={false} />
              </Col>

              <Col span={24} md={8}>
                <div className="sticky top-16 p-7 rounded-lg shadow-lg bg-white border border-gray-200">
                  <Row gutter={[20, 20]} align={"middle"}>
                    <div className="mb-3">
                      <Avatar
                        alt="company-logo"
                        size={80}
                        shape="square"
                        src={jobDetail.company?.logo}
                        className="mx-auto h-20 object-contain cursor-pointer"
                        onClick={() => {
                          navigate(`/company/${jobDetail.company?._id}`);
                        }}
                      />
                    </div>
                    <div
                      className="text-lg text-black hover:text-gray-700 transition duration-200 ease-in-out font-bold cursor-pointer mb-3 ms-2"
                      onClick={() => {
                        navigate(`/company/${jobDetail.company?._id}`);
                      }}
                    >
                      {jobDetail.company?.name}
                    </div>
                  </Row>
                  <div className="text-gray-500 mb-3">
                    {truncateContent(
                      jobDetail?.company?.description || "",
                      100
                    )}
                  </div>
                </div>
              </Col>
            </>
          )}
        </Row>
      )}
      <ApplyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        jobDetail={jobDetail}
      />
    </div>
  );
};
export default ClientJobDetailPage;
