import React from "react";
import { Modal, Button } from "antd";
import GuestCards from "../../Guests/GuestCards";

const GuestSelect = (props) => {
  const { visible, setVisible, onSelect } = props;

  return (
    <Modal
      open={visible}
      title="Выберите гостя"
      onCancel={() => setVisible(false)}
      width="50%"
      footer={[
        <Button key="c" onClick={() => setVisible(false)}>
          Отмена
        </Button>,
      ]}
    >
      <GuestCards onSelect={onSelect} />
    </Modal>
  );
};

export default GuestSelect;
