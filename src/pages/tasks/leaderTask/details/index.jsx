import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeaderTaskInfo } from "./components/LeaderTaskInfo";
import { LeaderTaskOrderDetails } from "./components/LeaderTaskOrderDetails";
import { UserContext } from "../../../../providers/user";
import OrderApi from "../../../../apis/order";
import { Button, Space, Spin, message } from "antd";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import routes from "../../../../constants/routes";
import { TaskProvider } from "../../../../providers/task";
import { OrderStatus, PageSize } from "../../../../constants/enum";
import OrderDetailApi from "../../../../apis/order-details";
import { ALL_PERMISSIONS, roles } from "../../../../constants/app";
import OrderReportApi from "../../../../apis/order-report";
import ApiCodes from "../../../../constants/apiCode";
import { LeaderTaskOrderReportModal } from "../components/LeaderTaskOrderReportModal";
import { usePermissions } from "../../../../hooks/permission";
import { MaterialModal } from "../components/MaterialModal";
import { DamagedModal } from "../components/DamagedModal";

export const LeaderTaskDetailsPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.leadersTasks.view);

  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [orderDetailInfo, setOrderDetailInfo] = useState();
  const [managerOrder, setManagerOrder] = useState([]);
  const [showOrderReportModal, setShowOrderReportModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showDamagedModal, setShowDamagedModal] = useState(false);
  const [orderReportLoading, setOrderReportLoading] = useState(false);

  const navigate = useNavigate();

  const syncMaterials = async () => {
    setLoading(true);
    const syncMaterial = await OrderApi.updateQuote(id);
    if (syncMaterial) {
      message.success(`Cập nhật nguyên vât liệu thành công`);
      getData(id, true);
    } else {
      message.error(`Cập nhật thất bại`);
    }
    setLoading(false);
    // setMaterial(syncMaterial);
  };

  const getOrderStatus = async () => {
    setLoading(true);
    const getOrderStatus = await OrderApi.updateOrderStatus(1, id);
    if (getOrderStatus) {
      message.success(`Báo giá thành công`);
      getData(id, true);
    } else {
      message.error(`Báo giá thất bại`);
    }
    setLoading(false);

    // setOrderStatus(getOrderStatus);
  };

  const getData = (handleLoading, pageIndex, search) => {
    if (handleLoading) {
      setLoading(true);
    }

    if (!id) return;

    // retrieve order data by id
    OrderApi.getOrderById(id).then((dataOrder) => {
      setOrderInfo(dataOrder);
      getDataOrderDetail(handleLoading, dataOrder?.id, 1);
      setManagerOrder(user?.role?.name === roles.FOREMAN && user?.id === dataOrder?.assignToId);
    });
    setLoading(false);
  };

  const getDataOrderDetail = async (handleLoading, orderId, pageIndex, search) => {
    if (handleLoading) {
      setLoading(true);
    }

    if (!orderId) return;

    let orderDetailData = [];
    for (let index = pageIndex; index >= 1; index--) {
      orderDetailData = await OrderDetailApi.getListByOrderId(
        orderId,
        search,
        index,
        PageSize.LEADER_TASK_ORDER_DETAIL_LIST
      );
      console.log("orderDetailData", orderDetailData);
      if (index === 1 || (orderDetailData && orderDetailData?.data?.length > 0)) {
        setOrderDetailInfo(orderDetailData);
        break;
      }
    }
    setLoading(false);
  };

  const handleSubmitOrderReport = async (values) => {
    setOrderReportLoading(true);
    console.log("send order report", values);
    const resp = await OrderReportApi.createOrderReport(values);
    if (resp) {
      message.info("Tạo báo cáo thành công");
      setShowOrderReportModal(false);
    } else {
      message.error("Tạo báo cáo thất bại");
    }
    setOrderReportLoading(false);
  };

  useEffect(() => {
    getData(true);
  }, [id]);

  return canView && (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.managersTasks}`)}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          {
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => setShowMaterialModal(true)}
              >
                Danh sách nguyên vật liệu
              </Button>
              {(orderInfo.status === OrderStatus.InProgress ||
                orderInfo.status === OrderStatus.Completed) && (
                <Button
                  type="primary"
                  style={{ marginRight: "10px" }}
                  className="btn-primary app-bg-primary font-semibold text-white"
                  onClick={() => setShowDamagedModal(true)}
                >
                  Danh sách cung cấp
                </Button>
              )}
              {(orderInfo.status !== OrderStatus.Completed ||
                orderInfo.status !== OrderStatus.Cancel) && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="primary"
                    className="btn-primary app-bg-primary font-semibold text-white"
                    onClick={() => setShowOrderReportModal(true)}
                  >
                    Báo cáo tiến độ đơn hàng
                  </Button>
                </div>
              )}
              {(orderInfo.status === OrderStatus.Pending ||
                orderInfo.status === OrderStatus.Reject ||
                orderInfo.status === OrderStatus.Request) && (
                <>
                  <Button
                    style={{ marginLeft: "10px" }}
                    type="primay"
                    className="btn-primary app-bg-primary font-semibold text-white"
                    onClick={() => syncMaterials()}
                  >
                    Cập nhật nguyên vật liệu
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    type="primay"
                    className="btn-primary app-bg-primary font-semibold text-white"
                    onClick={() => getOrderStatus()}
                  >
                    Báo giá đơn hàng
                  </Button>
                </>
              )}
            </div>
          }
          <TaskProvider
            tasks={taskInfo}
            allTasks={allTasks}
            info={orderInfo}
            orderDetails={orderDetailInfo}
            onReload={(handleLoading) => {
              getDataOrderDetail(handleLoading, orderInfo?.id, 1);
            }}
            onFilterTask={(pageIndex, search) => {
              getDataOrderDetail(false, orderInfo?.id, pageIndex, search);
            }}
          >
            <div className="mt-4">
              <LeaderTaskInfo loading={loading} />
            </div>
            <div className="mt-4">
              <LeaderTaskOrderDetails title="Danh sách vật liệu" />
            </div>
            <LeaderTaskOrderReportModal
              open={showOrderReportModal}
              onCancel={() => {
                setShowOrderReportModal(false);
              }}
              onSubmit={handleSubmitOrderReport}
              confirmLoading={orderReportLoading}
              message={message}
              title="Báo cáo tiến độ đơn hàng"
            />
            <MaterialModal
              open={showMaterialModal}
              onCancel={() => {
                setShowMaterialModal(false);
              }}
              title="Danh sách tài nguyên đơn hàng"
              orderId={id}
            />
            <DamagedModal
              open={showDamagedModal}
              onCancel={() => {
                setShowDamagedModal(false);
              }}
              title="Danh sách tài nguyên đã cung cấp"
              orderId={id}
            />
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};
