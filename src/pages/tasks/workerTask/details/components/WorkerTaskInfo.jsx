import { Typography, Col, Row, Space, Card, Collapse, Button, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { formatDate, getTaskStatusColor, getTaskStatusName } from "../../../../../utils";
import { UserContext } from "../../../../../providers/user";
import { ETaskStatus, TaskStatus } from "../../../../../constants/enum";
import { TaskContext } from "../../../../../providers/task";
import ReportApi from "../../../../../apis/task-report";
import { TaskProblemReportModal, TaskReportModal } from "../../components/TaskProblemReportModal";
import { roles } from "../../../../../constants/app";
import {
  TaskAcceptanceModal,
  TaskProgressReportModal,
} from "../../components/TaskProgressReportModal";
import LeaderTasksApi from "../../../../../apis/leader-task";
import {
  LeaderTaskTaskReportModal,
  TaskAcceptanceReportModal,
} from "../../components/TaskAcceptanceReportModal";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export const WorkerTaskInfo = ({ loading }) => {
  const { Title } = Typography;
  const { user } = useContext(UserContext);
  const { info, team, tasks, accepted: acceptance, acceptanceTask } = useContext(TaskContext);
  const { leaderTaskId } = useParams();
  const [problemReportLoading, setProblemReportLoading] = useState(false);
  const [acceptanceReportLoading, setAcceptanceReportLoading] = useState(false);
  const [progressReportLoading, setProgressReportLoading] = useState(false);
  const [materialList, setMaterialList] = useState([]);
  const [showProblemReportModal, setShowProblemReportModal] = useState(false);
  const [showAcceptanceModal, setShowAcceptanceReportModal] = useState(false);
  const [showProgressReportModal, setShowProgressReportModal] = useState(false);

  const isLeader = user?.role?.name === roles.LEADER;

  const { name, leaderName, status, startTime, endTime, item } = info || [];

  const isLeaderStatusProgress = status === ETaskStatus.InProgress;
  const isLeaderStatusAcceptance = status === ETaskStatus.Acceptance;

  const completedTasks = tasks?.data?.filter((e) => e.status === TaskStatus.Completed);
  const isCompletedTasks =
    tasks?.total >= 1 && completedTasks && completedTasks.length === tasks?.total;

  const handleProblemReportCreate = async (values) => {
    setProblemReportLoading(true);
    values.createdDate = new Date();
    console.log("create report: ", values);
    const report = await ReportApi.sendProblemReport(values);
    if (report.code === 0) {
      setShowProblemReportModal(false);
      message.info("Tạo báo cáo thành công!");
    } else {
      message.error(report.message);
    }
    setProblemReportLoading(false);
  };

  const handleAcceptanceReportCreate = async (values) => {
    setAcceptanceReportLoading(true);
    console.log("create acceptance report: ", values);
    const report = await ReportApi.sendAcceptanceReport(values);
    if (report.code === 0) {
      setShowAcceptanceReportModal(false);
      message.info("Tạo báo cáo thành công!");
      acceptanceTask();
    } else {
      message.error(report.message);
    }
    setAcceptanceReportLoading(false);
  };

  const handleProgressReportCreate = async (values) => {
    setProgressReportLoading(true);
    console.log("create progress report: ", values);
    const report = await ReportApi.createProgressReport(values);
    if (report.code === 0) {
      setShowProgressReportModal(false);
      message.info("Tạo báo cáo thành công!");
    } else {
      message.error(report.message);
    }
    setProgressReportLoading(false);
  };

  const getMaterial = async () => {
    setProgressReportLoading(true);
    const material = await LeaderTasksApi.getMaterialByLeaderId(leaderTaskId);
    setMaterialList(material.data)
    console.log("Material: ", material.data);
    setProgressReportLoading(false);
  };

  useEffect(() => {
    getMaterial();
  }, []);


  const defaultValue = (value) => {
    return <Text style={{ color: "red" }}>{value}</Text>;
  };

  return (
    <Space direction="vertical" className="w-full gap-6">
      <Row justify="middle">
        <Col span={17}>
          <Title level={4} style={{ marginBottom: 10 }} ellipsis>
            Chi tiết việc làm {name}
          </Title>
        </Col>
        {isLeader && (isLeaderStatusProgress && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                style={{ marginLeft: "10px" }}
                type="primary"
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => setShowProblemReportModal(true)}
                disabled={acceptance}
              >
                Báo cáo vấn đề
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                type="primary"
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => setShowProgressReportModal(true)}
              // disabled={acceptance}
              >
                Báo cáo tiến độ
              </Button>
            </div>
          </>
        ))
        }
        {isLeader && isLeaderStatusAcceptance && (
          <>
            {isCompletedTasks && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  style={{ marginLeft: "10px" }}
                  type="primary"
                  className="btn-primary app-bg-success font-semibold text-white"
                  onClick={() => setShowAcceptanceReportModal(true)}
                  disabled={acceptance}
                >
                  Báo cáo nghiệm thu
                </Button>
              </div>
            )}
          </>
        )
        }
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card style={{ borderRadius: "1rem" }} loading={loading}>
            <Row gutter={[16, 16]}>
              <Col className="gutter-row" span={8}>
                Tên công việc: <strong>{name}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Tên tổ trưởng:{" "}
                <strong>{leaderName || defaultValue("Không xác định được Tổ trưởng")}</strong>
              </Col>
              <Col></Col>
              <Col className="gutter-row" span={8}>
                Ngày bắt đầu:{" "}
                <strong>
                  {formatDate(startTime, "DD/MM/YYYY") || defaultValue("Chưa thêm ngày")}
                </strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Ngày kết thúc:{" "}
                <strong>
                  {formatDate(endTime, " DD/MM/YYYY") || defaultValue("Chưa thêm ngày")}
                </strong>
              </Col>
              <Col className="gutter-row" span={8}>
                <span>
                  Tình trạng:{" "}
                  <strong style={{ color: getTaskStatusColor(status) }}>
                    {getTaskStatusName(status)}
                  </strong>
                </span>
              </Col>
            </Row>
            {isLeader && (
              <Row gutter={[16, 16]}>
                <Col className="gutter-row" span={24}>
                  <Collapse
                    ghost
                    items={[
                      {
                        label: `Thành viên nhóm (${team?.length ?? 0})`,
                        children: (
                          <Row gutter={[16, 16]}>
                            {team?.map((item, index) => (
                              <Col className="gutter-row" span={4} key={item.id}>
                                <Button type="text">
                                  {index + 1}. {item.fullName}
                                  {user?.id === item.id && (
                                    <span className="ml-2" style={{ fontWeight: "bold" }}>
                                      (Tôi)
                                    </span>
                                  )}
                                </Button>
                              </Col>
                            ))}
                          </Row>
                        ),
                      },
                    ]}
                  />
                </Col>
              </Row>
            )}
            <Row gutter={[16, 16]}>
              <Col className="gutter-row" span={24}>
                <Collapse
                  ghost
                  items={[
                    {
                      label: `Danh sách vật liệu (${materialList?.length ?? 0})`,
                      children: (
                        <Row gutter={[16, 16]}>
                          {materialList?.map((item, index) => (
                            <Col className="gutter-row" span={24} key={item.materialId}>
                              {index + 1}. Vật liệu: {item.name} - Số lượng: {item.quantity}
                            </Col>
                          ))}
                        </Row>
                      ),
                    },
                  ]}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {isLeader && (
        <>
          <TaskProblemReportModal
            open={showProblemReportModal}
            title="Thêm báo cáo vấn đề"
            onCancel={() => {
              setShowProblemReportModal(false);
            }}
            onSubmit={handleProblemReportCreate}
            confirmLoading={problemReportLoading}
          />

          <TaskAcceptanceReportModal
            open={showAcceptanceModal}
            title="Thêm báo cáo nghiệm thu"
            onCancel={() => {
              setShowAcceptanceReportModal(false);
            }}
            onSubmit={handleAcceptanceReportCreate}
            confirmLoading={acceptanceReportLoading}
          />

          <TaskProgressReportModal
            open={showProgressReportModal}
            onCancel={() => {
              setShowProgressReportModal(false);
            }}
            onSubmit={handleProgressReportCreate}
            confirmLoading={progressReportLoading}
            message={message}
            title="Báo cáo tiến độ"
          />
        </>
      )}
    </Space>
  );
};
