import { useState } from "react";
import { Button, Modal } from "antd";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { call } from "@/actions/axios";
import { useDispatch } from "react-redux";

const { confirm } = Modal;

const Pause = (props) => {
  const { guest, setGuest, loading } = props;
  const [processing, setProcessing] = useState(false);

  const dispatch = useDispatch();

  const onConfirm = () => {
    let values = {};

    if (guest.pausedAt) {
      values = {
        title: "Возобновить время гостя?",
        content: "Отменив действие, время восстановится",
      };
    } else {
      values = {
        title: "Приостановить время гостя?",
        content: "Данное действие можно отменить в любое время",
      };
    }

    confirm({
      ...values,
      icon: <ExclamationCircleFilled />,
      onOk() {
        onSubmit();
      },
    });
  };

  const onSubmit = async () => {
    try {
      setProcessing(true);

      const values = {
        guest: guest._id,
        date: dayjs().format("YYYY-MM-DD HH:mm"),
      };

      const { data } = await dispatch(
        call({ url: `guests/pause`, method: "POST", data: values })
      );

      setGuest(data);

      setProcessing(false);
    } catch (e) {
      setProcessing(false);
    }
  };

  const pauseButton = () => {
    if (guest.pausedAt) {
      return (
        <Button
          ghost
          type="primary"
          disabled={processing || loading}
          onClick={onConfirm}
        >
          <PlayCircleOutlined />
          Возобновить время
        </Button>
      );
    } else {
      return (
        <Button
          ghost
          type="primary"
          disabled={processing || loading}
          onClick={onConfirm}
        >
          <PauseCircleOutlined />
          Приостановить время
        </Button>
      );
    }
  };
  return pauseButton();
};

export default Pause;
