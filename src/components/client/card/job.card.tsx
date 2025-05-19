import { callFetchJob } from "../../../service/job.api";
import { LOCATION_LIST, getLocationName } from "../../../config/utils";
import { IJob } from "../../../types/backend";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Empty, Pagination, Row, Spin } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface IProps {
  showPagination?: boolean;
}

const JobCard = (props: IProps) => {
  const { showPagination = false } = props;

  const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJob();
  }, [current, pageSize, filter, sortQuery]);

  const fetchJob = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchJob(query);
    if (res && res.data) {
      setDisplayJob(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleViewDetailJob = (item: IJob) => {
    navigate(`/job/${item._id}`);
  };

  return (
    <div className="p-4">
      <Spin spinning={isLoading} tip="Loading...">
        <Row gutter={[20, 20]}>
          {!showPagination && (
            <Col span={24}>
              <div className="mb-6 text-center">
                <h2 className="text-4xl font-bold text-black">
                  Công Việc Mới Nhất
                </h2>
              </div>
            </Col>
          )}

          {displayJob?.map((item) => {
            return (
              <Col span={24} md={12} key={item._id}>
                <Card
                  size="small"
                  onClick={() => handleViewDetailJob(item)}
                  className="rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex gap-4 items-start">
                    <Avatar
                      shape="square"
                      size={64}
                      src={item?.company?.logo}
                      alt={item.name}
                    />

                    <div className="flex flex-col flex-1">
                      <div className="text-xs text-gray-500 mb-1">
                        {dayjs(item.updatedAt).fromNow()}
                      </div>

                      <div className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {item.name}
                      </div>

                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <EnvironmentOutlined className="text-teal-500 mr-1" />
                        {getLocationName(item.location)}
                      </div>

                      <div className="flex items-center text-orange-500 text-sm mt-1">
                        <ThunderboltOutlined className="mr-1" />
                        {(item.salary + "")?.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}{" "}
                        đ
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}

          {(!displayJob || displayJob.length === 0) && !isLoading && (
            <Col span={24}>
              <Empty description="Không có dữ liệu" />
            </Col>
          )}
        </Row>

        {showPagination ? (
          <div className="mt-10 flex justify-center">
            <Pagination
              current={current}
              total={total}
              pageSize={pageSize}
              responsive
              onChange={(p, s) =>
                handleOnchangePage({ current: p, pageSize: s })
              }
            />
          </div>
        ) : (
          <div className="mt-10 flex justify-center">
            <div
              onClick={() => {
                navigate("/job");
              }}
              className="bg-white text-blue border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-50 cursor-pointer transition duration-200 ease-in-out"
            >
              <span className="text-blue-500 font-semibold text-lg px-4">
                Xem hơn {total} công việc đang chờ bạn &#62;
              </span>
            </div>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default JobCard;
