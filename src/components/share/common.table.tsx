import { Table } from "antd";
import type { TableProps } from "antd";

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
}

interface CommonTableProps<T> {
  data: T[];
  loading: boolean;
  columns: TableProps<T>["columns"];
  rowKey?: string | ((record: T) => string);
  pagination?: PaginationProps;
  handleTableChange?: (
    pagination: PaginationProps,
    filters: any,
    sorter: any,
    extra: any
  ) => void;
}

const CommonTable = <T extends object>({
  data,
  columns,
  loading,
  rowKey = "_id",
  pagination,
  handleTableChange,
}: CommonTableProps<T>) => {
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={rowKey}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50],
      }}
      onChange={(pagination, filters, sorter, extra) => {
        if (handleTableChange) {
          handleTableChange(
            pagination as PaginationProps,
            filters,
            sorter,
            extra
          );
        }
      }}
    />
  );
};

export default CommonTable;
