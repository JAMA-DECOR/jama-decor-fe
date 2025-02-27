import React, { useEffect, useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Form, Input, Select, Typography, message } from "antd";
import ProcedureApi from "../../../apis/procedure";
import { AddWorkerToGroupModal } from "../../group/detail/components/AddWorkerToGroupModal";
import GroupApi from "../../../apis/group";

export const ProcedureModal = ({ data, options, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const formRef = useRef();
  console.log(data);

  const [listStep, setListStep] = useState(data?.listStep || []);
  const [loading, setLoading] = useState(false);
  const [addWorkerToGroupModal, setAddWorkerToGroupModal] = useState(false);

  console.log(listStep);
  const handleWorkerNotInGroup = async () => {
    setLoading(true);
    const response = await GroupApi.getAllWorkerNoYetGroup();
    setAddWorkerToGroupModal(response.data);
    setLoading(false);
  };

  const handleChange = async (value) => {
    setListStep(
      value?.map((e, i) => {
        return {
          stepId: e,
          priority: i,
        };
      })
    );
    console.log(value);
  };

  useEffect(() => {
    handleWorkerNotInGroup();
    setListStep([]);
  }, []);

  useEffect(() => {
    handleWorkerNotInGroup();
    setListStep(data?.listStep || []);
  }, [data]);

  const handleSubmit = async (values) => {
    setLoading(true);
    values = { ...values, listStep };
    const success = isCreate
      ? await ProcedureApi.createItem(values)
      : await ProcedureApi.updateItem(values);
    if (success) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
      onCancel();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleWorkerNotInGroup();
  }, []);

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`${typeMessage} quy trình`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form layout="vertical" ref={formRef} initialValues={{ ...data }} onFinish={handleSubmit}>
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên quy trình"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên quy trình",
            },
          ]}
        >
          <Input placeholder="Nhập tên quy trình..." />
        </Form.Item>
        <Typography name="listStep">Danh sách các bước</Typography>
        <Select
          showSearch
          name="listStep"
          label="Danh sách các bước"
          key={listStep?.length}
          mode="multiple"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(new Error("Vui lòng chọn các bước cần thực hiện."));
                }
                return Promise.resolve();
              },
            },
          ]}
          style={{ width: "100%" }}
          placeholder="Chọn các bước cần thực hiện..."
          value={listStep?.map((e) => e.stepId)} // Use value instead of defaultValue
          onChange={handleChange}
          options={options}
        ></Select>
      </Form>
    </BaseModal>
  );
};
