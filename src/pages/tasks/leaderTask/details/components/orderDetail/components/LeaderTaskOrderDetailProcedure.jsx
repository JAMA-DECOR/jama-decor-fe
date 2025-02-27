import { Edit, Forbid, More, Unlock, Plus, PreviewOpen, FileExcel } from "@icon-park/react";
import { Typography, Row, message, Col } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "../../../../../../../components/BaseTable";
import confirm from "antd/es/modal/confirm";
import Dropdown from "antd/lib/dropdown/dropdown";
import { Button } from "antd/lib";
import { ETaskStatus, OrderStatus, PageSize, modalModes } from "../../../../../../../constants/enum";
import LeaderTasksApi from "../../../../../../../apis/leader-task";
import routes from "../../../../../../../constants/routes";
import { TaskContext } from "../../../../../../../providers/task";
import { LeaderTaskModal } from "../../../../components/LeaderTaskModal";
import ReportApi from "../../../../../../../apis/task-report";
import { formatDate, getTaskStatusColor, getTaskStatusName } from "../../../../../../../utils";
import { LeaderTaskAcceptanceModal } from "../../../../components/LeaderTaskAcceptanceModal";
import UserApi from "../../../../../../../apis/user";
import GroupApi from "../../../../../../../apis/group";

export const LeaderTaskOrderDetailProcedure = ({
  title,
}) => {

  const { tasks, info, reload, filterTask, accepted, allTasks } = useContext(TaskContext);

  const { Title } = Typography;
  const titleInfo = title + ` (${tasks?.total ? tasks.total : 0})`;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAcceptanceReportModal, setShowAcceptanceReportModal] = useState(false);
  const [eTaskCreateLoading, setETaskCreateLoading] = useState(false);
  const [eTaskUpdateLoading, setETaskUpdateLoading] = useState(false);
  const [acceptanceReportLoading, setAcceptanceReportLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState("")
  const [leadersData, setLeadersData] = useState([]);

  const leaderTaskInfo = useRef();

  const completedTasks = allTasks?.data?.filter(
    (e) => e.status === ETaskStatus.Completed
  );

  const isCompletedTasks = allTasks?.total >= 1
    && completedTasks && completedTasks.length === allTasks?.total;

  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          leaderTaskInfo.current = record;
          navigate(routes.dashboard.workersTasks + "/" + id, {
            state: {
              orderId: info.orderId,
              orderDetailId: info.id,
            }
          }, { replace: true });
        },
      },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          handleShowModal(record?.id);
        },
      },
      {
        key: "SET_STATUS",
        label: isActive ? "Mở khóa" : "Xoá",
        danger: !isActive,
        icon: !isActive ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Xoá tiến độ",
            content: `Chắc chắn xoá "${record.name}"?`,
            type: "confirm",
            cancelText: "Hủy",
            onOk: () => deleteTaskProcedure(record.id),
            onCancel: () => { },
            closable: true,
          });
        },
      },
    ];
  };

  const handleShowModal = async (eTaskId) => {
    if (!eTaskId) return;
    const data = await LeaderTasksApi.getLeaderTaskById(eTaskId);
    if (data.code === 0) {
      console.log("data detail", data.data)
      leaderTaskInfo.current = data.data;
      setShowUpdateModal(true);
    } else {
      message.error(data.message);
    }
  }

  const columns = [
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      // align: "center",
      width: "10%",
      render: (_, record) => {
        return <span>{record.priority}</span>;
      },
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: "Tên công việc",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Tổ trưởng",
      dataIndex: "leaderName",
      key: "leaderName",
      sorter: (a, b) => a.leaderName.localeCompare(b.leaderName),
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "itemQuantity",
      key: "itemQuantity",
      sorter: (a, b) => a.itemQuantity < b.itemQuantity,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      align: "center",
      render: (_, record) => {
        const formattedDate = formatDate(record.startTime, "DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      sorter: (a, b) => a.startTime.localeCompare(b.startTime),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      align: "center",
      render: (_, record) => {
        const formattedDate = formatDate(record.endTime, "DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      sorter: (a, b) => a.endTime.localeCompare(b.endTime),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        return (
          <span style={{ color: getTaskStatusColor(record.status), fontWeight: "bold" }}>
            {getTaskStatusName(record.status)}
          </span>
        );
      },
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getActionItems(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const handleReload = (value = searchData, current = currentPage) => {
    setLoading(true);
    setSearchData(value);
    filterTask(current, value);
    setLoading(false);
  };

  const handleSearch = (value) => {
    setLoading(true);
    setCurrentPage(1);
    handleReload(value);
    setLoading(false);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    handleReload(searchData, current);
  };

  const handleSubmitCreate = async (values) => {
    setETaskCreateLoading(true);
    const data = {
      name: values?.name,
      itemId: values?.itemId,
      leaderId: values?.leaderId,
      itemId: info?.itemId,
      priority: values?.priority,
      itemQuantity: values?.itemQuantity,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values?.description,
      orderId: info?.orderId,
    }
    console.log("create", data)
    try {
      const create = await LeaderTasksApi.createLeaderTasks(data);
      if (create.code === 0) {
        message.success(create.message);
        setShowCreateModal(false);
        handleReload();
      } else {
        message.error(create.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setETaskCreateLoading(false);
    }
  };

  const handleSubmitUpdate = async (values) => {
    setETaskUpdateLoading(true);
    const data = {
      id: values?.id,
      name: values?.name || "Nghiệm thu",
      priority: values?.priority,
      leaderId: values?.leaderId,
      itemQuantity: values?.itemQuantity,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values?.description,
      status: values?.status,
    }
    try {
      console.log("update task: ", data);
      const update = await LeaderTasksApi.updateLeaderTasks(data);
      if (update.code === 0) {
        message.success(update.message);
        setShowUpdateModal(false);
        handleReload();
      } else {
        message.error(update.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setETaskUpdateLoading(false);
    }
  };

  const deleteTaskProcedure = async (value) => {
    console.log("deleteTaskProcedure", value)
    setLoading(true);
    try {
      const success = await LeaderTasksApi.deleteLeaderTasks(value);
      if (success) {
        message.success(success.message);
        handleReload();
      } else {
        message.error(success.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAcceptanceReportCreate = async (values) => {
    console.log("create task acceptance", values)
    setAcceptanceReportLoading(true);
    try {
      const resp = await LeaderTasksApi.createAcceptanceTasks(values);
      if (resp.code === 0) {
        message.success(resp.message);
        setShowAcceptanceReportModal(false);
        handleReload();
      } else {
        message.error(resp.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setAcceptanceReportLoading(false);
    }
  }

  const handleRetrieveLeaderInfo = async () => {
    const resp = await GroupApi.getAllLeaderHaveGroup();
    setLeadersData(resp?.data);
  }

  useEffect(() => {
    handleRetrieveLeaderInfo();
  }, []);

  return (
    <>
      <Row align="middle" className="mb-3" justify="space-between">
        <Row align="middle">
          <Title level={4} style={{ margin: 0 }}>
            {titleInfo}
          </Title>
          {info?.status === OrderStatus.InProgress &&
            <Button
              icon={<Plus />}
              className="flex-center ml-3"
              shape="circle"
              type="primary"
              onClick={() => {
                handleRetrieveLeaderInfo();
                setShowCreateModal(true);
              }
              }
            />
          }
          {!accepted && isCompletedTasks &&
            <Col>
              <Button
                className="flex-center ml-3"
                type="primary"
                onClick={() => {
                  handleRetrieveLeaderInfo();
                  setShowAcceptanceReportModal(true);
                }}
              >
                <Plus style={{ display: "flex" }} /> Nghiệm thu
              </Button>
            </Col>
          }
        </Row>
      </Row>
      <BaseTable
        dataSource={tasks?.data}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.LEADER_TASK_PROCEDURE_LIST,
          total: tasks?.total,
          current: currentPage,
        }}
        rowKey={(record) => record.id}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm công việc...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <LeaderTaskModal
        open={showCreateModal}
        onCancel={() => {
          leaderTaskInfo.current = null;
          setShowCreateModal(false);
        }}
        onSubmit={handleSubmitCreate}
        confirmLoading={eTaskCreateLoading}
        dataSource={[]}
        mode={modalModes.CREATE}
        leadersData={leadersData}
      />
      <LeaderTaskModal
        open={showUpdateModal}
        onCancel={() => {
          leaderTaskInfo.current = null;
          setShowUpdateModal(false);
        }}
        onSubmit={handleSubmitUpdate}
        confirmLoading={eTaskUpdateLoading}
        dataSource={leaderTaskInfo.current}
        mode={modalModes.UPDATE}
        message={message}
        leadersData={leadersData}
      />
      <LeaderTaskAcceptanceModal
        open={showAcceptanceReportModal}
        onCancel={() => {
          leaderTaskInfo.current = null;
          setShowAcceptanceReportModal(false)
        }}
        onSubmit={handleSubmitAcceptanceReportCreate}
        confirmLoading={acceptanceReportLoading}
        title={"Thêm công việc nghiệm thu"}
        leadersData={leadersData}
      />
    </>
  );
};