import React, { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { TaskColumn } from "./TaskColumn";
import { Col, Row, message } from "antd";
import { TeamContext } from "../../../../../providers/team";
import { TaskStatus } from "../../../../../constants/enum";
import { TaskColumnId } from "../../../../../constants/app";
import { UserContext } from "../../../../../providers/user";
import TaskApi from "../../../../../apis/task";

export const TaskBoard = ({ onViewTask, onDeleteTask }) => {
	const { user } = useContext(UserContext);
	const { team, reload } = useContext(TeamContext);

	const isLeader = user?.userId === team?.leader?.id;

	const [columns, setColumns] = useState([
		{
			id: TaskColumnId.TODO,
			title: "Cần làm",
			tasks: [],
		},
		{
			id: TaskColumnId.IN_PROGRESS,
			title: "Đang làm",
			tasks: [],
		},
		{
			id: TaskColumnId.COMPLETED,
			title: "Đã hoàn thành",
			tasks: [],
		},
	]);

	const onDragEnd = (result) => {
		const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		var canDrop = true;
		const taskId = draggableId;
		const task = team?.tasks.find((e) => e.id === taskId);
		const ownedTask =
			task?.members.find((e) => e.id === user?.userId) !== undefined;

		if (!isLeader && !ownedTask) {
			canDrop = false;
		}

		if (!canDrop) {
			message.info(
				"Chỉ trưởng nhóm hoặc những thành viên được phân công mới được chuyển trạng thái công việc này"
			);
			return;
		}

		const finish = columns.find((e) => e.id === destination.droppableId);
		var taskStatus;
		switch (finish.id) {
			case TaskColumnId.TODO:
				taskStatus = TaskStatus.new;
				break;
			case TaskColumnId.IN_PROGRESS:
				taskStatus = TaskStatus.inProgress;
				break;
			case TaskColumnId.COMPLETED:
				taskStatus = TaskStatus.completed;
				break;
			default:
		}

		if (taskId !== undefined && taskStatus !== undefined) {
			console.log("123");
			TaskApi.updateTaskStatus(taskId, taskStatus).then((success) => {
				if (success) {
					reload(false);
				}
			});
		}
	};

	useEffect(() => {
		const tasks = team?.tasks;
		const todoTasks = tasks?.filter((e) => e.status === TaskStatus.new);
		const inProgressTasks = tasks?.filter(
			(e) => e.status === TaskStatus.inProgress
		);
		const completedTasks = tasks?.filter(
			(e) => e.status === TaskStatus.completed
		);
		const newColumns = [...columns];
		for (let i = 0; i < newColumns.length; i++) {
			const column = newColumns[i];
			if (column.id === TaskColumnId.TODO) {
				column.tasks = todoTasks;
			}
			if (column.id === TaskColumnId.IN_PROGRESS) {
				column.tasks = inProgressTasks;
			}
			if (column.id === TaskColumnId.COMPLETED) {
				column.tasks = completedTasks;
			}
		}
		setColumns(newColumns);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [team]);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Row gutter={16}>
				{columns.map((column) => (
					<Col key={column.id} span={8}>
						<TaskColumn
							column={column}
							onViewTask={onViewTask}
							onDeleteTask={onDeleteTask}
						/>
					</Col>
				))}
			</Row>
		</DragDropContext>
	);
};
