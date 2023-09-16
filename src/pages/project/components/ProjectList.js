import React from "react";
import { Table, Button, Tag } from "antd";
import { mockAccounts } from "../../../../__mocks__/account";
import { roles } from "../../../../constants/app";
import { Edit } from "@icon-park/react";

const ProjectList = ({ onEditAccount }) => {
	const getRoleName = (role) => {
		switch (role) {
			case roles.ADMIN:
				return "Admin";
			case roles.STUDENT:
				return "Sinh viên";
			case roles.TEACHER:
				return "Giáo viên";
			default:
				return undefined;
		}
	};

	const columns = [
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Họ tên",
			dataIndex: "fullName",
			key: "fullName",
		},
		{
			title: "Vai trò",
			dataIndex: "role",
			key: "role",
			render: (_, { role }) => {
				return (
					<Tag
						color={
							role === roles.ADMIN
								? "blue"
								: role === roles.STUDENT
								? "cyan"
								: "purple"
						}
					>
						{getRoleName(role)}
					</Tag>
				);
			},
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render: (_, { active }) => {
				return (
					<Tag color={active ? "blue-inverse" : "red-inverse"}>
						{active ? "Đang hoạt động" : "Khóa"}
					</Tag>
				);
			},
		},
		{
			title: "Thao tác",
			dataIndex: "action",
			key: "action",
			render: (_, record) => {
				return (
					<Button
						onClick={onEditAccount}
						className="flex-center"
						icon={<Edit />}
					/>
				);
			},
		},
	];

	return <Table dataSource={mockAccounts} columns={columns} />;
};

export default ProjectList;
