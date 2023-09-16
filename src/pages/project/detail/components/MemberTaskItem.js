import { Tag } from "antd";
import React from "react";
import { useRole } from "../../../../hooks/role";
import { roles } from "../../../../constants/app";

export const MemberTaskItem = ({ member, onRemove }) => {
	const role = useRole();

	return (
		<Tag
			color="geekblue"
			closable={role === roles.STUDENT}
			onClose={(e) => {
				e.stopPropagation();
				onRemove && onRemove(member);
			}}
		>
			{member.memberFullName}
		</Tag>
	);
};
