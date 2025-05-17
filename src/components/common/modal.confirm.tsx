import { Modal } from "antd";

const ConfirmModal = (props: {
  title: string;
  content: string;
  onOk: () => void | Promise<void>;
  onCancel: () => void;
  open: boolean;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
}) => {
  const {
    title,
    content,
    onOk,
    onCancel,
    open,
    okText,
    cancelText,
    confirmLoading,
  } = props;

  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText || "Xác nhận"}
      cancelText={cancelText || "Hủy"}
      confirmLoading={confirmLoading}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
