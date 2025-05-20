import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCompany } from "../../redux/slice/company.slice";
import { ICompany } from "../../types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Popconfirm, Space, TableProps, Typography } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { callDeleteCompany } from "../../service/company.api";
import Access from "../../components/share/access";
import { ALL_PERMISSIONS } from "../../config/permissions";
import CommonTable from "../../components/share/common.table";
import queryString from "query-string";
import ModalCompany from "../../components/admin/company/modal.company";
import DetailDrawer from "../../components/common/view.detail";
import HTMLReactParser from "html-react-parser/lib/index";

const CompanyPage = () => {
  const { message, notification } = App.useApp();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<ICompany | null>(null);

  const isFetching = useAppSelector((state) => state.company.isFetching);
  const meta = useAppSelector((state) => state.company.meta);
  const companies = useAppSelector((state) => state.company.result);
  const dispatch = useAppDispatch();

  const handleDeleteCompany = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteCompany(_id);
      if (res && res.data) {
        message.success("Xóa Company thành công");
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
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
      label: "Address",
      key: "address",
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
      label: "Description",
      key: "description",
      render: (text: string) => {
        return <span>{HTMLReactParser(text)}</span>;
      },
    },
  ];

  const columns: TableProps<ICompany>["columns"] = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 250,
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              setOpenDetail(true);
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
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Actions",
      width: 50,
      render: (_value, entity) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.COMPANIES.UPDATE} hideChildren>
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
          <Access permission={ALL_PERMISSIONS.COMPANIES.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa company"}
              description={"Bạn có chắc chắn muốn xóa company này ?"}
              onConfirm={() => handleDeleteCompany(entity._id)}
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
    if (clone.address) clone.address = `/${clone.address}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.address) {
      sortBy = sort.address === "ascend" ? "sort=address" : "sort=-address";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

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

    dispatch(fetchCompany({ query }));
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
    dispatch(fetchCompany({ query }));
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
    dispatch(fetchCompany({ query }));
  }, []);

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}>
        <Typography.Title level={3}>Danh sách công ty</Typography.Title>
        <Access permission={ALL_PERMISSIONS.COMPANIES.CREATE} hideChildren>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModal(true)}
            className="my-2"
          >
            Thêm mới
          </Button>
        </Access>
        <CommonTable<ICompany>
          columns={columns}
          data={companies}
          loading={isFetching}
          pagination={{
            pageSize: meta.pageSize,
            current: meta.current,
            total: meta.total,
          }}
          handleTableChange={handleTableChange}
        />
      </Access>
      <ModalCompany
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <DetailDrawer
        open={openDetail}
        title="Chi tiết công ty"
        columns={columnsDetail}
        data={dataInit}
        onClose={() => {
          setOpenDetail(false);
          setDataInit(null);
        }}
        width={600}
      />
    </div>
  );
};

export default CompanyPage;
