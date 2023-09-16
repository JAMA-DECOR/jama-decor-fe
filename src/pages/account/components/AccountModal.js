import React from "react";
import BaseModal from "../../../components/BaseModal";
import { Form, Input, Select } from "antd";
import { roles } from "../../../constants/app";

export const AccountModal = ({ open, onCancel, account, title }) => {
	const roleOptions = [
		{
			value: roles.STUDENT,
			label: "Sinh viên",
		},
		{
			value: roles.TEACHER,
			label: "Giáo viên",
		},
	];

	const statusOptions = [
		{
			value: true,
			label: "Hoạt động",
		},
		{
			value: false,
			label: "Khóa",
		},
	];

	return (
		<BaseModal title={title} open={open} onCancel={onCancel}>
			<Form layout="vertical" initialValues={account}>
				<Form.Item
					name="email"
					label="Email"
					rules={[{ required: true, message: "Vui lòng nhập email" }]}
				>
					<Input placeholder="Nhập email..." />
				</Form.Item>
				<Form.Item
					name="fullName"
					label="Họ tên"
					rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
				>
					<Input placeholder="Nhập họ tên..." />
				</Form.Item>
				<Form.Item name="role" label="Vai trò">
					<Select defaultValue={roles.STUDENT} options={roleOptions} />
				</Form.Item>
				<Form.Item name="status" label="Trạng thái">
					<Select defaultValue={true} options={statusOptions} />
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
