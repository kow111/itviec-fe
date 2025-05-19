import { callFetchCompany } from "../../../service/company.api";
import { ICompany } from "../../../types/backend";
import { Col, Empty, Pagination, Row, Spin } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface IProps {
  showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
  const { showPagination = false } = props;

  const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompany();
  }, [current, pageSize, filter, sortQuery]);

  const fetchCompany = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) query += `&${filter}`;
    if (sortQuery) query += `&${sortQuery}`;

    const res = await callFetchCompany(query);
    if (res && res.data) {
      setDisplayCompany(res.data.result);
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

  const handleViewDetailJob = (item: ICompany) => {
    if (item.name) {
      navigate(`/company/${item._id}`);
    }
  };

  return (
    <div className=" p-4">
      <Spin spinning={isLoading} tip="Loading...">
        <div className="mb-6 flex justify-center items-center">
          {!showPagination && (
            <h2 className="text-4xl font-bold text-black">Top Employers</h2>
          )}
        </div>

        <Row gutter={[20, 20]}>
          {displayCompany?.map((item) => (
            <Col key={item._id} span={24} sm={12} md={8}>
              <div
                className="h-[300px] flex flex-col transition-shadow shadow-md hover:shadow-lg rounded-xl cursor-pointer bg-white border border-gray-200"
                onClick={() => handleViewDetailJob(item)}
              >
                <img
                  alt={item.name}
                  src={item?.logo}
                  className="h-50 object-contain p-4 mx-auto rounded-2xl"
                />

                <h3 className="text-center text-xl font-semibold text-gray-800">
                  {item.name}
                </h3>

                <div className="mt-auto flex justify-center items-center bg-gray-50 p-4 rounded-b-xl">
                  <p className="text-gray-600 text-base line-clamp-1">
                    {item?.address || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </Col>
          ))}

          {(!displayCompany || displayCompany.length === 0) && !isLoading && (
            <div className="w-full flex justify-center py-10">
              <Empty description="Không có dữ liệu" />
            </div>
          )}
        </Row>

        {showPagination && (
          <div className="mt-10 flex justify-center">
            <Pagination
              current={current}
              total={total}
              pageSize={pageSize}
              responsive
              onChange={(p: number, s: number) =>
                handleOnchangePage({ current: p, pageSize: s })
              }
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default CompanyCard;
