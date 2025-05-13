import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { IRole } from "../../types/backend";
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
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { callDeleteRole } from "../../service/role.api";
import queryString from "query-string";
import { fetchRole, fetchRoleById } from "../../redux/slice/role.slice";
import { ALL_PERMISSIONS } from "../../config/permissions";
import Access from "../../components/share/access";
import CommonTable from "../../components/share/common.table";
import DetailDrawer from "../../components/common/view.detail";
import ModalRole from "../../components/admin/role/modal.role";

const RolePage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IRole | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const isFetching = useAppSelector((state) => state.role.isFetching);
  const meta = useAppSelector((state) => state.role.meta);
  const roles = useAppSelector((state) => state.role.result);
  const dispatch = useAppDispatch();

  const handleDeleteRole = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteRole(_id);
      if (res && res.data) {
        message.success("Xóa Role thành công");
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
    dispatch(fetchRole({ query }));
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

    dispatch(fetchRole({ query }));
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
      label: "Mô tả",
      key: "description",
    },
    {
      label: "Trạng thái",
      key: "isActive",
      render: (text: any) => {
        return (
          <Tag color={text ? "lime" : "red"}>
            {text ? "ACTIVE" : "INACTIVE"}
          </Tag>
        );
      },
    },
    {
      label: "Ngày tạo",
      key: "createdAt",
      render: (text: any) => {
        return <span>{dayjs(text).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      label: "Ngày cập nhật",
      key: "updatedAt",
      render: (text: any) => {
        return <span>{dayjs(text).format("DD/MM/YYYY")}</span>;
      },
    },
  ];

  const columns: TableProps<IRole>["columns"] = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 250,
      render: (text, record) => {
        return (
          <a
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
      title: "Trạng thái",
      dataIndex: "isActive",
      render(dom, entity) {
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
          <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: "#ffa500",
              }}
              type=""
              onClick={() => {
                dispatch(fetchRoleById(entity._id as string));
                setOpenModal(true);
              }}
            />
          </Access>
          <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa role"}
              description={"Bạn có chắc chắn muốn xóa role này ?"}
              onConfirm={() => handleDeleteRole(entity._id)}
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

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
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
    dispatch(fetchRole({ query }));
  }, []);

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}>
        <Typography.Title level={3}>Danh sách vai trò</Typography.Title>
        <Access permission={ALL_PERMISSIONS.ROLES.CREATE} hideChildren>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModal(true)}
            className="my-2"
          >
            Thêm mới
          </Button>
        </Access>
        <CommonTable<IRole>
          loading={isFetching}
          columns={columns}
          data={roles}
          handleTableChange={handleTableChange}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
          }}
        />
      </Access>
      <ModalRole
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
      />
      <DetailDrawer
        open={openViewDetail}
        title="Chi tiết vai trò"
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

export default RolePage;
