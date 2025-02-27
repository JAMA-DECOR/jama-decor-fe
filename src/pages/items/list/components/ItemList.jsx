import { Edit, Lightning, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space, Table, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { ItemModal } from "../../components/ItemModal";
import { ItemDuplicateModal } from "../../components/ItemDuplicate";
import ItemApi from "../../../../apis/item";
import ItemCategoryApi from "../../../../apis/item-category";
import ProcedureApi from "../../../../apis/procedure";
import { PageSize } from "../../../../constants/enum";
import MaterialApi from "../../../../apis/material";
import StepApi from "../../../../apis/step";
import { useNavigate, useParams } from "react-router-dom";
import routes from "../../../../constants/routes";
import { ProcedureModal } from "../../../procedures/components/ProcedureModal";
import { formatMoney, formatNum } from "../../../../utils";
import { StepModal } from "../../../steps/components/StepModal";

const ItemList = ({ canModify }) => {
  const [loading, setLoading] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showItemDuplicateModal, setShowItemDuplicateModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemCategoryList, setItemCategoryList] = useState([]);
  const [listProcedures, setListProcedures] = useState([]);
  const [listSteps, setListSteps] = useState([]);
  const [listMaterials, setListMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  const [showProcedurepModal, setShowProcedurepModal] = useState(false);
  const prodRef = useRef();

  const [showStepModal, setShowStepModal] = useState(false);
  const stepRef = useRef();

  const searchRef = useRef();
  const itemRef = useRef();

  const getData = async (search, pageIndex, handleLoading = true) => {
    handleLoading && setLoading(true);
    let response = await ItemApi.getAllItem(search, pageIndex, PageSize.ITEM_LIST);
    setItemList(response);
    response = await ItemCategoryApi.getAllItem();
    setItemCategoryList(response.data.data);
    response = await ProcedureApi.getAll();
    setListProcedures(response.data);
    response = await MaterialApi.getAllMaterial();
    setListMaterials(response.data);
    response = await StepApi.getAllWithoutPaging();
    setListSteps(response);
    handleLoading && setLoading(false);
  };

  const showModal = (item) => {
    setLoading(true);
    setPreviewUrl(item.imageUrl);
    setLoading(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPreviewUrl("");
    setIsModalOpen(false);
  };

  const getActionItems = (record) => {
    const { isActive, id } = record;
    return [
      canModify.canUpdate && {
        key: "UPDATE_ITEM",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          itemRef.current = record;
          setShowItemModal(true);
        },
      },
      canModify.canCreate && {
        key: "DUPLICATE_ITEM",
        label: "Sao chép sản phẩm",
        icon: <Lightning />,
        onClick: () => {
          itemRef.current = record;
          setShowItemDuplicateModal(true);
        },
      },
      canModify.canUpdate && {
        key: "SET_STATUS",
        label: "Xoá",
        danger: !isActive,
        icon: !isActive ? <Forbid /> : <Unlock />,
        onClick: ({ id }) => {
          if (window.confirm("Bạn chắc chắn muốn xoá?")) {
            const success = ItemApi.deleteItem(id);
            success && getData(searchRef.current, currentPage, true);
          }
        },
      },
    ];
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{index + 1 + (currentPage - 1) * PageSize.ITEM_LIST}</span>;
      },
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
      width: "10%",
      render: (_, record) => {
        return <span>{record?.code || "-"}</span>;
      },
      sorter: (a, b) => a.code - b.code,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <Tooltip title={() => <img loading="eager" src={record?.image} className="w-full" />}>
            {record.name}
          </Tooltip>
        );
      },
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "itemCategoryName",
      key: "itemCategoryName",
      width: "20%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.itemCategoryName || "-"}</span>;
      },
      sorter: (a, b) => a?.itemCategoryName - b?.itemCategoryName,
    },
    {
      title: "Dài",
      dataIndex: "length",
      key: "length",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.length || "-"}</span>;
      },
      sorter: (a, b) => a?.length - b?.length,
    },

    {
      title: "Sâu",
      dataIndex: "depth",
      key: "depth",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.depth || "-"}</span>;
      },
      sorter: (a, b) => a?.depth - b?.depth,
    },
    {
      title: "Cao",
      dataIndex: "height",
      key: "height",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.height || "-"}</span>;
      },
      sorter: (a, b) => a?.height - b?.height,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: "7%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.unit || "-"}</span>;
      },
      sorter: (a, b) => a?.unit - b?.unit,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      width: "12%",
      render: (price) => {
        const prices = formatNum(price);
        return `${formatMoney(prices)}`;
      },
      sorter: (a, b) => a?.price - b?.price,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Dropdown
            menu={{ items: getActionItems(record) }}
            disabled={!canModify.canCreate || !canModify.canUpdate}
          >
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const getActionProcedures = (record) => {
    return [
      {
        key: "UPDATE_PROCEDURE",
        label: "Chỉnh sửa",
        icon: <Edit />,
        onClick: () => {
          prodRef.current = listProcedures.find((ew) => ew.id === record.procedureId);
          setShowProcedurepModal(true);
        },
      },
    ];
  };
  const expandedProcedureRender = (row) => {
    // columns for procedure
    const columns = [
      {
        title: "Quy trình",
        width: "30%",
        dataIndex: "procedureId",
        key: "procedureId",
        render: (_, { procedure }) => <span>{procedure?.name}</span>,
        sorter: (a, b) => a?.name - b?.name,
      },
      {
        title: "Độ ưu tiên",
        width: "12%",
        align: "center",
        dataIndex: "priority",
        key: "priority",
        sorter: (a, b) => a?.priority - b?.priority,
      },
      {
        title: "Danh sách các bước",
        dataIndex: "listStep",
        key: "listStep",
        render: (_, { procedure }) =>
          procedure?.listStep?.map((e, i) => (
            <p className="my-1">
              {i + 1}. {listSteps?.find((step) => step.id === e.stepId)?.name}
            </p>
          )),
      },
      {
        title: "Thao tác",
        dataIndex: "action",
        key: "action",
        width: "10%",
        align: "center",
        render: (_, record, index) => {
          return (
            <Dropdown menu={{ items: getActionProcedures(record) }}>
              <Button className="mx-auto flex-center" icon={<More />} />
            </Dropdown>
          );
        },
      },
    ];
    return (
      <Table
        size="small"
        columns={columns}
        dataSource={row.listProcedure?.map((e) => {
          return {
            ...e,
            key: e.procedureId,
            procedure: listProcedures?.find((p) => p.id === e.procedureId) || null,
          };
        })}
        pagination={false}
        expandable={{
          expandedRowRender: expandedStepRender,
        }}
        style={{ marginRight: "4%" }}
      />
    );
  };

  const getActionSteps = (record) => {
    return [
      {
        key: "UPDATE_STEP",
        label: "Chỉnh sửa",
        icon: <Edit />,
        onClick: () => {
          stepRef.current = listSteps?.find((ew) => ew.id === record.stepId);
          setShowStepModal(true);
        },
      },
    ];
  };
  const expandedStepRender = (row) => {
    // columns for procedure
    const columns = [
      {
        title: "Bước",
        width: "30%",
        dataIndex: "stepId",
        key: "stepId",
        render: (_, { step }) => <span>{step?.name}</span>,
      },
      {
        title: "Độ ưu tiên",
        width: "12%",
        align: "center",
        dataIndex: "priority",
        key: "priority",
        render: (_, { priority }) => <span>{priority + 1}</span>,
        sorter: (a, b) => a?.priority - b?.priority,
      },
      {
        title: "Thao tác",
        dataIndex: "action",
        key: "action",
        width: "10%",
        align: "center",
        render: (_, record, index) => {
          return (
            <Dropdown menu={{ items: getActionSteps(record) }}>
              <Button className="mx-auto flex-center" icon={<More />} />
            </Dropdown>
          );
        },
      },
    ];
    return (
      <Table
        size="small"
        columns={columns}
        dataSource={row.listStep?.map((e) => {
          return {
            ...e,
            key: e.stepId,
            step: listSteps?.find((p) => p.id === e.stepId) || null,
          };
        })}
        pagination={false}
        style={{ marginRight: "4%" }}
      />
    );
  };

  const handleSearch = (value) => {
    searchRef.current = value;
    getData(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(searchRef.current, current, false);
  };

  useEffect(() => {
    getData(null, 1, true);
  }, []);

  return (
    <>
      <Space direction="vertical" className="w-full gap-6">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{ marginLeft: "10px", marginBottom: "10px" }}
            type="primary"
            className="btn-primary app-bg-primary font-semibold text-white"
            onClick={() => navigate(`${routes.dashboard.root}/${routes.dashboard.itemsLog}`)}
          >
            Lịch sử chỉnh sửa
          </Button>
          <Button
            style={{ marginLeft: "10px", marginBottom: "10px" }}
            disabled={!canModify.canCreate || !canModify.canUpdate}
            type="primay"
            className="btn-primary app-bg-primary font-semibold text-white"
            onClick={() => setShowItemModal(true)}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </Space>
      <BaseTable
        title="Danh sách sản phẩm"
        dataSource={itemList?.data?.map((e) => {
          return { ...e, key: e.id };
        })}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.ITEM_LIST,
          total: itemList?.total,
        }}
        expandable={{
          expandedRowRender: expandedProcedureRender,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm sản phẩm...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <ItemModal
        data={itemRef.current}
        listItemNames={itemList.data?.map((i) => i.name)}
        listCategories={itemCategoryList.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        })}
        listProcedures={listProcedures.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        })}
        listMaterials={listMaterials.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        })}
        open={showItemModal}
        onCancel={() => {
          setShowItemModal(false);
          itemRef.current = null;
        }}
        onSuccess={() => getData()}
      />
      <ItemDuplicateModal
        data={itemRef.current}
        open={showItemDuplicateModal}
        onCancel={() => {
          setShowItemDuplicateModal(false);
          itemRef.current = null;
        }}
        id={id}
        onSuccess={() => getData()}
      />
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>

      <ProcedureModal
        data={prodRef.current}
        options={listSteps?.map((e) => {
          return {
            label: e.name,
            value: e.id,
          };
        })}
        open={showProcedurepModal}
        onCancel={() => {
          setShowProcedurepModal(false);
          prodRef.current = null;
        }}
        onSuccess={() => getData(searchRef.current, currentPage, true)}
      />

      <StepModal
        data={stepRef.current}
        open={showStepModal}
        onCancel={() => {
          setShowStepModal(false);
          stepRef.current = null;
        }}
        onSuccess={() => getData(searchRef.current, currentPage, true)}
      />
    </>
  );
};

export default ItemList;
