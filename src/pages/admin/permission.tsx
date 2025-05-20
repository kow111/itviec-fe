import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { IPermission } from "../../types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Space,
  TableProps,
  Typography,
  message,
  notification,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import queryString from "query-string";
import { fetchPermission } from "../../redux/slice/permission.slice";
// import ViewDetailPermission from "@/components/admin/permission/view.permission";
// import ModalPermission from "@/components/admin/permission/modal.permission";

import Access from "../../components/share/access";
import { ALL_PERMISSIONS } from "../../config/permissions";
import { callDeletePermission } from "../../service/permission.api";
import CommonTable from "../../components/share/common.table";
import { colorMethod } from "../../config/utils";
import DetailDrawer from "../../components/common/view.detail";
import ModalPermission from "../../components/admin/permission/modal.permission";

const PermissionPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IPermission | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const isFetching = useAppSelector((state) => state.permission.isFetching);
  const meta = useAppSelector((state) => state.permission.meta);
  const permissions = useAppSelector((state) => state.permission.result);
  const dispatch = useAppDispatch();

  const handleDeletePermission = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeletePermission(_id);
      if (res && res.data) {
        message.success("Xóa Permission thành công");
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
    dispatch(fetchPermission({ query }));
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

    dispatch(fetchPermission({ query }));
  };

  const columnsDetail = [
    {
      label: "Id",
      key: "_id",
    },
    {
      label: "Name",
      key: "name",
    },
    {
      label: "API",
      key: "apiPath",
    },
    {
      label: "Method",
      key: "method",
      render(text: any) {
        return (
          <p
            style={{
              paddingLeft: 10,
              fontWeight: "bold",
              marginBottom: 0,
              color: colorMethod(text),
            }}
          >
            {text || ""}
          </p>
        );
      },
    },
    {
      label: "Module",
      key: "module",
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
  ];

  const columns: TableProps<IPermission>["columns"] = [
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
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "API",
      dataIndex: "apiPath",
      sorter: true,
    },
    {
      title: "Method",
      dataIndex: "method",
      sorter: true,
      render(_, entity) {
        return (
          <p
            style={{
              paddingLeft: 10,
              fontWeight: "bold",
              marginBottom: 0,
              color: colorMethod(entity?.method as string),
            }}
          >
            {entity?.method || ""}
          </p>
        );
      },
    },
    {
      title: "Module",
      dataIndex: "module",
      sorter: true,
    },
    {
      title: "Actions",
      width: 50,
      render: (_value, entity) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: "#ffa500",
              }}
              type=""
              onClick={() => {
                setOpenModal(true);
                setDataInit(entity);
              }}
            />
          </Access>
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa permission"}
              description={"Bạn có chắc chắn muốn xóa permission này ?"}
              onConfirm={() => handleDeletePermission(entity._id)}
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

  const buildQuery = (params: any, sort: any, _: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.apiPath) clone.apiPath = `/${clone.apiPath}/i`;
    if (clone.method) clone.method = `/${clone.method}/i`;
    if (clone.module) clone.module = `/${clone.module}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.apiPath) {
      sortBy = sort.apiPath === "ascend" ? "sort=apiPath" : "sort=-apiPath";
    }
    if (sort && sort.method) {
      sortBy = sort.method === "ascend" ? "sort=method" : "sort=-method";
    }
    if (sort && sort.module) {
      sortBy = sort.module === "ascend" ? "sort=module" : "sort=-module";
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

    return temp;
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
    dispatch(fetchPermission({ query }));
  }, []);

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}>
        <Typography.Title level={3}>Danh sách quyền hạn</Typography.Title>
        <Access permission={ALL_PERMISSIONS.PERMISSIONS.CREATE} hideChildren>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModal(true)}
            className="my-2"
          >
            Thêm mới
          </Button>
        </Access>
        <CommonTable<IPermission>
          loading={isFetching}
          columns={columns}
          data={permissions}
          handleTableChange={handleTableChange}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
          }}
        />
      </Access>
      <ModalPermission
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />

      <DetailDrawer
        open={openViewDetail}
        title="Chi tiết quyền hạn"
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

export default PermissionPage;
