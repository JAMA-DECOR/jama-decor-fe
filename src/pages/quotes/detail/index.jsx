import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { OrderDetailsProvider } from "../../../providers/orderDetails";
import OrderDetailApi from "../../../apis/order-details";
import { QuoteDetail } from "./components/QuoteDetail";
import React, { useEffect, useRef, useState } from "react";
import OrderApi from "../../../apis/order";
import { useParams } from "react-router";
import { Button, Dropdown, Spin, Typography } from "antd";
import UserApi from "../../../apis/user";
import { BaseTable } from "../../../components/BaseTable";
import { Edit, More } from "@icon-park/react";
import routes from "../../../constants/routes";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const QuoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState();
  const [itemList, setItemList] = useState();
  const [users, setUsers] = useState();

  const quoteRef = useRef();

  const getDetails = async () => {
    if (!id) return;
    setLoading(true);
    let data = await OrderApi.getOrderById(id);
    setDetails(data);
    data = await OrderDetailApi.getListByOrderId(id);
    setItemList(data);
    data = await UserApi.getAll();
    setUsers(data);
    setLoading(false);
  };

  const handleSearch = async (search) => {
    setLoading(true);
    let data = await OrderDetailApi.getListByOrderId(id, search);
    setItemList(data);
    data = await UserApi.getAll();
    setUsers(data);
    setLoading(false);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "itemName",
      key: "itemName",
      width: "25%",
      render: (_, record) => <span>{record?.item?.name}</span>,
      sorter: (a, b) => a?.item?.name.localeCompare(b?.item?.name),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      sorter: (a, b) => a?.quantity.localeCompare(b?.quantity),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a?.price.localeCompare(b?.price),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a?.totalPrice.localeCompare(b?.totalPrice),
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      width: "30%",
      // sorter: (a, b) => a?.description.localeCompare(b?.description),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getActionItems(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const getActionItems = (record) => {
    return [
      {
        key: "UPDATE_QUOTE_ITEM",
        label: "Cập nhật sản phẩm",
        icon: <Edit />,
        onClick: () => {
          quoteRef.current = record;
          // setShowOrderModal(true);
        },
      },
    ];
  };

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <BasePageContent onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.orders}`)}>
      <Spin spinning={loading}>
        <OrderDetailsProvider
          details={details}
          list={itemList}
          users={users}
          reload={() => getDetails()}
        >
          <section className="mt-4">
            <QuoteDetail />
          </section>
          <section className="mt-4">
            <BaseTable
              title="Danh sách sản phẩm"
              dataSource={itemList}
              columns={columns}
              loading={loading}
              pagination={{ pageSize: 5, pageSizeOptions: [] }}
              searchOptions={{
                visible: true,
                placeholder: "Tìm kiếm sản phẩm...",
                onSearch: handleSearch,
                width: 300,
              }}
            />
          </section>
        </OrderDetailsProvider>
      </Spin>
    </BasePageContent>
  );
};

export default QuoteDetailPage;
