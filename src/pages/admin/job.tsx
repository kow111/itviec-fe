import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { IJob } from "../../types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Space,
  TableProps,
  Tag,
  Typography,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { callDeleteJob } from "../../service/job.api";
import queryString from "query-string";
import { fetchJob } from "../../redux/slice/job.slice";
import Access from "../../components/share/access";
import { ALL_PERMISSIONS } from "../../config/permissions";
import { useEffect, useState } from "react";
import CommonTable from "../../components/share/common.table";
import DetailDrawer from "../../components/common/view.detail";
import { LOCATION_LIST } from "../../config/utils";
import HTMLReactParser from "html-react-parser/lib/index";
import ModalJob from "../../components/admin/job/modal.job";

const JobPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IJob | null>(null);
  const isFetching = useAppSelector((state) => state.job.isFetching);
  const meta = useAppSelector((state) => state.job.meta);
  const jobs = useAppSelector((state) => state.job.result);
  const dispatch = useAppDispatch();

  const handleDeleteJob = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteJob(_id);
      if (res && res.data) {
        message.success("Xóa Job thành công");
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const reloadTable = () => {
    const query = buildQuery(
      {
        current: meta.current,
        pageSize: meta.pageSize,
      },
      {},
      {}
    );
    dispatch(fetchJob({ query }));
  };

  const columnsDetail = [
    {
      label: "Id",
      key: "_id",
    },
    {
      label: "Tên Job",
      key: "name",
    },
    {
      label: "Mức lương",
      key: "salary",
      render: (text: string) => {
        const str = "" + text;
        return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</>;
      },
    },
    {
      label: "Kỹ năng",
      key: "skills",
      render: (text: string[]) => {
        return (
          <>
            {text.map((item, index) => {
              return (
                <Tag key={index} color="blue">
                  {item}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      label: "Số lượng",
      key: "quantity",
    },
    {
      label: "Ngày bắt đầu",
      key: "startDate",
      render: (text: string) => {
        return <span>{dayjs(text).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      label: "Ngày kết thúc",
      key: "endDate",
      render: (text: string) => {
        return <span>{dayjs(text).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      label: "Địa chỉ",
      key: "location",
      render: (text: string) => {
        return (
          <span>
            {LOCATION_LIST.filter((item) => item.value === text)[0]?.label ||
              text}
          </span>
        );
      },
    },
    {
      label: "Level",
      key: "level",
    },
    {
      label: "Trạng thái",
      key: "isActive",
      render(text: any) {
        return (
          <>
            <Tag color={text ? "lime" : "red"}>
              {text ? "ACTIVE" : "INACTIVE"}
            </Tag>
          </>
        );
      },
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (text: string) => {
        return <span>{dayjs(text).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      label: "Updated At",
      key: "updatedAt",
      render: (text: string) => {
        return <span>{dayjs(text).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      label: "Tình trạng",
      key: "isActive",
      render(text: any) {
        return (
          <>
            <Tag color={text ? "lime" : "red"}>
              {text ? "ACTIVE" : "INACTIVE"}
            </Tag>
          </>
        );
      },
    },
    {
      label: "Description",
      key: "description",
      render: (text: string) => {
        return <span>{HTMLReactParser(text)}</span>;
      },
    },
  ];

  const columns: TableProps<IJob>["columns"] = [
    {
      title: "Id",
      dataIndex: "_id",
      render(_, entity) {
        return (
          <a
            onClick={() => {
              setDataInit(entity);
              setOpenViewDetail(true);
            }}
          >
            {entity._id}
          </a>
        );
      },
    },
    {
      title: "Tên Job",
      dataIndex: "name",
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      sorter: true,
      render(_, entity) {
        const str = "" + entity.salary;
        return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</>;
      },
    },
    {
      title: "Level",
      dataIndex: "level",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render(_, entity) {
        return (
          <>
            <Tag color={entity.isActive ? "lime" : "red"}>
              {entity.isActive ? "ACTIVE" : "INACTIVE"}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Actions",
      width: 50,
      render: (_value, entity) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.JOBS.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: "#ffa500",
              }}
              type=""
              onClick={() => {
                setDataInit(entity);
                setOpenModal(true);
              }}
            />
          </Access>
          <Access permission={ALL_PERMISSIONS.JOBS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa job"}
              description={"Bạn có chắc chắn muốn xóa job này ?"}
              onConfirm={() => handleDeleteJob(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 10px" }}>
                <DeleteOutlined
                  style={{
                    fontSize: 20,
                    color: "#ff4d4f",
                  }}
                />
              </span>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.salary) clone.salary = `/${clone.salary}/i`;
    if (clone?.level?.length) {
      clone.level = clone.level.join(",");
    }

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.salary) {
      sortBy = sort.salary === "ascend" ? "sort=salary" : "sort=-salary";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `${temp}&sort=-createdAt`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    _extra: any
  ) => {
    const { current, pageSize } = pagination;

    const sortParams =
      sorter && sorter.order ? { [sorter.field]: sorter.order } : {};

    const query = buildQuery(
      {
        current,
        pageSize,
      },
      sortParams,
      filters
    );

    dispatch(fetchJob({ query }));
  };

  useEffect(() => {
    const query = buildQuery(
      {
        current: 1,
        pageSize: 5,
      },
      {},
      {}
    );
    dispatch(fetchJob({ query }));
  }, []);

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}>
        <Typography.Title level={3}>Danh sách công việc</Typography.Title>
        <Access permission={ALL_PERMISSIONS.JOBS.CREATE} hideChildren>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModal(true)}
            className="my-2"
          >
            Thêm mới
          </Button>
        </Access>
        <CommonTable<IJob>
          columns={columns}
          data={jobs}
          loading={isFetching}
          pagination={{
            pageSize: meta.pageSize,
            current: meta.current,
            total: meta.total,
          }}
          handleTableChange={handleTableChange}
        />
      </Access>
      <ModalJob
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <DetailDrawer
        open={openViewDetail}
        title="Chi tiết công việc"
        columns={columnsDetail}
        data={dataInit}
        onClose={() => {
          setOpenViewDetail(false);
          setDataInit(null);
        }}
        width={600}
      />
    </div>
  );
};

export default JobPage;
