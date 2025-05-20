import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUser } from "../../redux/slice/user.slice";
import { IUser } from "../../types/backend";
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
import { callDeleteUser } from "../../service/user.api";
import queryString from "query-string";
// import ModalUser from "@/components/admin/user/modal.user";
// import ViewDetailUser from "@/components/admin/user/view.user";
import Access from "../../components/share/access";
import { ALL_PERMISSIONS } from "../../config/permissions";
import CommonTable from "../../components/share/common.table";
import DetailDrawer from "../../components/common/view.detail";
import ModalUser from "../../components/admin/user/modal.user";

const UserPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IUser | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const isFetching = useAppSelector((state) => state.user.isFetching);
  const meta = useAppSelector((state) => state.user.meta);
  const users = useAppSelector((state) => state.user.result);
  const dispatch = useAppDispatch();

  const handleDeleteUser = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteUser(_id);
      if (res && res.data) {
        message.success("Xóa User thành công");
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
    dispatch(fetchUser({ query }));
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
      label: "Email",
      key: "email",
    },
    {
      label: "Gender",
      key: "gender",
    },
    {
      label: "Age",
      key: "age",
    },
    {
      label: "Company",
      key: "company",
      render: (text: any) => {
        return <span>{text?.name}</span>;
      },
    },
    {
      label: "Role",
      key: "role",
      render: (text: any) => {
        return <span>{text?.name}</span>;
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
  ];

  const columns: TableProps<IUser>["columns"] = [
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
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },

    {
      title: "Actions",
      width: 50,
      render: (_value, entity) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.USERS.UPDATE} hideChildren>
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

          <Access permission={ALL_PERMISSIONS.USERS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa user"}
              description={"Bạn có chắc chắn muốn xóa user này ?"}
              onConfirm={() => handleDeleteUser(entity._id)}
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
    if (clone.email) clone.email = `/${clone.email}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.email) {
      sortBy = sort.email === "ascend" ? "sort=email" : "sort=-email";
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
    temp +=
      "&populate=role,company&fields=role._id, role.name, company._id, company.name";

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

    dispatch(fetchUser({ query }));
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
    dispatch(fetchUser({ query }));
  }, []);

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}>
        <Typography.Title level={3}>Danh sách người dùng</Typography.Title>
        <Access permission={ALL_PERMISSIONS.USERS.CREATE} hideChildren>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModal(true)}
            className="my-2"
          >
            Thêm mới
          </Button>
        </Access>
        <CommonTable<IUser>
          columns={columns}
          data={users}
          rowKey="_id"
          loading={isFetching}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
          }}
          handleTableChange={handleTableChange}
        />
      </Access>
      <ModalUser
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <DetailDrawer
        open={openViewDetail}
        title="Chi tiết công ty"
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

export default UserPage;
