import { Drawer, Descriptions } from "antd";
import React from "react";

interface ColumnItem {
  label: string;
  key: string;
  render?: (value: any, record?: any) => React.ReactNode;
}

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  data?: Record<string, any> | null;
  columns: ColumnItem[];
  width?: number;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({
  open,
  onClose,
  title = "Chi tiết",
  data,
  columns,
  width = 600,
}) => {
  return (
    <Drawer
      title={title}
      placement="right"
      width={width}
      onClose={onClose}
      open={open}
    >
      {data ? (
        <Descriptions column={1} bordered>
          {columns.map((col) => (
            <Descriptions.Item label={col.label} key={col.key}>
              {col.render ? col.render(data[col.key], data) : data[col.key]}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <p>Dữ liệu không tồn tại</p>
      )}
    </Drawer>
  );
};

export default DetailDrawer;
