import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select } from "antd";
// import { Dropdown, Upload, Menu } from "antd";
// import { InboxOutlined } from "@ant-design/icons";
import { Context } from ".";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(null);

  const form = useRef();
  const dispatch = useDispatch();

  const places = useSelector((state) => state.app.places || []);

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      const { places, image, ...rest } = values;
      setPath(image);
      form.current.setFieldsValue({
        ...rest,
        places: places.map((v) => v._id),
      });
    }
  }, [editing]);

  useEffect(() => {
    if (!adding && form.current) {
      form.current.resetFields();
      setPath(null);
    }
  }, [adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (path) {
      values.image = path;
    }

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `menu_categories/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["menu_categories"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `menu_categories`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["menu_categories"], data));
        setAdding(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  // const customRequest = async (options) => {
  //   const { file } = options;
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     const headers = {
  //       "Content-type": "multipart/form-data",
  //     };
  //     const { data } = await dispatch(
  //       call({
  //         url: `menu_categories/upload`,
  //         method: "POST",
  //         data: formData,
  //         headers,
  //       })
  //     );
  //     const { path } = data;
  //     setPath(path);
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };

  const onDelete = () => {
    if (!path) return;
    dispatch(
      call({
        url: `menu_categories/upload/image`,
        method: "DELETE",
        data: { path },
      })
    );
  };

  const onCancel = () => {
    try {
      if (!editing) {
        onDelete();
      }
      setAdding(false);
    } catch (e) {}
  };

  // const onClick = (e) => {
  //   if (e.key === "1") {
  //     onDelete();
  //     setPath(null);
  //   }
  // };

  // const menu = (
  //   <Menu
  //     onClick={onClick}
  //     items={[
  //       {
  //         label: "Удалить",
  //         key: "1",
  //       },
  //     ]}
  //   />
  // );

  return (
    <Modal
      title="Создать"
      open={adding}
      okText="Сохранить"
      onCancel={onCancel}
      onOk={onSubmit}
      cancelButtonProps={{ loading }}
      okButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item
          label="Торговые точки"
          name="places"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading} mode="multiple" maxTagCount="responsive">
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/*path ? (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <img
              src={process.env.REACT_APP_BASE_URL + path}
              className="image-preview"
              alt="preview"
            />
          </Dropdown>
        ) : (
          <Upload.Dragger
            className="uploader"
            multiple={false}
            showUploadList={false}
            customRequest={customRequest}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Нажмите или перетащите файл для загрузки
            </p>
          </Upload.Dragger>
        )*/}
      </Form>
    </Modal>
  );
};

export default Comp;
