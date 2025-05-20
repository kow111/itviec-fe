import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { IDetailRecord, IResume } from "../../types/backend";
import { App, Avatar, Select, TableProps, Typography } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  // callDeleteResume,
  callUpdateResumeStatus,
} from "../../service/resume.api";
import queryString from "query-string";
import { fetchResume } from "../../redux/slice/resume.slice";
// import ViewDetailResume from "@/components/admin/resume/view.resume";
import { ALL_PERMISSIONS } from "../../config/permissions";
import Access from "../../components/share/access";
import CommonTable from "../../components/share/common.table";
import DetailDrawer from "../../components/common/view.detail";
import ConfirmModal from "../../components/common/modal.confirm";
const { Option } = Select;

const ResumePage = () => {
  const { message, notification } = App.useApp();
  const isFetching = useAppSelector((state) => state.resume.isFetching);
  const meta = useAppSelector((state) => state.resume.meta);
  const resumes = useAppSelector((state) => state.resume.result);
  const dispatch = useAppDispatch();

  const [dataInit, setDataInit] = useState<IResume | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);

  const handleChangeStatus = (value: string) => {
    setSelectedStatus(value);
    setOpenModalConfirm(true);
  };

  const handleConfirmChangeStatus = async () => {
    if (!dataInit?._id || !selectedStatus) return;

    setLoadingConfirm(true);
    const res = await callUpdateResumeStatus(dataInit._id, selectedStatus);
    if (res && res.data) {
      message.success("Thay đổi trạng thái thành công");
      setDataInit((prev) =>
        prev ? { ...prev, status: selectedStatus } : prev
      );
      reloadTable();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
    setOpenModalConfirm(false);
    setLoadingConfirm(false);
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
    dispatch(fetchResume({ query }));
  };

  const buildQuery = (params: any, sort: any, _: any) => {
    const clone = { ...params };
    // if (clone.name) clone.name = `/${clone.name}/i`;
    // if (clone.salary) clone.salary = `/${clone.salary}/i`;
    if (clone?.status?.length) {
      clone.status = clone.status.join(",");
    }

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.status) {
      sortBy = sort.status === "ascend" ? "sort=status" : "sort=-status";
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
      temp = `${temp}&sort=-updatedAt`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    temp +=
      "&populate=companyId,jobId&fields=companyId._id, companyId.name, companyId.logo, jobId._id, jobId.name";
    return temp;
  };

  // const handleDeleteResume = async (_id: string | undefined) => {
  //   if (_id) {
  //     const res = await callDeleteResume(_id);
  //     if (res && res.data) {
  //       message.success("Xóa Resume thành công");
  //       reloadTable();
  //     } else {
  //       notification.error({
  //         message: "Có lỗi xảy ra",
  //         description: res.message,
  //       });
  //     }
  //   }
  // };

  const columnsDetail: IDetailRecord[] = [
    {
      label: "Id",
      key: "_id",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Trạng Thái",
      key: "status",
      render: (text) => {
        return (
          <Select
            onChange={handleChangeStatus}
            style={{ width: "100%" }}
            value={text}
          >
            <Option value="PENDING">PENDING</Option>
            <Option value="REVIEWING">REVIEWING</Option>
            <Option value="APPROVED">APPROVED</Option>
            <Option value="REJECTED">REJECTED</Option>
          </Select>
        );
      },
    },
    {
      label: "Url CV",
      key: "url",
      render: (text) => {
        return (
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue" }}
          >
            {text}
          </a>
        );
      },
    },
    {
      label: "Job",
      key: "jobId",
      render: (text) => {
        return <div>{text?.name}</div>;
      },
    },
    {
      label: "Company",
      key: "companyId",
      render: (text) => {
        return (
          <div>
            <Avatar src={text?.logo} />
            {text?.name}
          </div>
        );
      },
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (text) => {
        return dayjs(text).format("DD/MM/YYYY");
      },
    },
    {
      label: "Updated At",
      key: "updatedAt",
      render: (text) => {
        return dayjs(text).format("DD/MM/YYYY");
      },
    },
  ];

  const columns: TableProps<IResume>["columns"] = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 250,
      render: (_, record) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true);
              setDataInit(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      sorter: true,
    },

    {
      title: "Job",
      dataIndex: ["jobId", "name"],
    },
    {
      title: "Company",
      dataIndex: ["companyId", "name"],
    },
  ];

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

    dispatch(fetchResume({ query }));
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
    dispatch(fetchResume({ query }));
  }, []);

  return (
    <>
      <Access permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}>
        <Typography.Title level={3}>Danh sách đơn ứng tuyển</Typography.Title>
        <CommonTable<IResume>
          loading={isFetching}
          columns={columns}
          data={resumes}
          handleTableChange={handleTableChange}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
          }}
        />
      </Access>
      <DetailDrawer
        open={openViewDetail}
        title="Chi tiết resume"
        columns={columnsDetail}
        onClose={() => {
          setOpenViewDetail(false);
          setDataInit(null);
        }}
        data={dataInit}
        width={600}
      />
      <ConfirmModal
        title="Thay đổi trạng thái"
        content="Bạn có chắc chắn muốn thay đổi trạng thái của resume này không?"
        onOk={handleConfirmChangeStatus}
        onCancel={() => setOpenModalConfirm(false)}
        open={openModalConfirm}
        confirmLoading={loadingConfirm}
      />
    </>
  );
};

export default ResumePage;
