import { Button, Dropdown, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BaseTable } from "../../../../../components/BaseTable";
import { PageSize, ReportMap, ReportType, ReportTypeMap, orderReportMap } from "../../../../../constants/enum";
import { Edit, More, ViewList } from "@icon-park/react";
import { formatDate } from "../../../../../utils";
import ReportApi from "../../../../../apis/task-report";
import TaskReportUpdateModal from "../../components/TaskReportUpdateModal";
import moment from "moment";

export const TaskReportList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectingOrderReport, setSelectingOrderReport] = useState();

  const getReports = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    const data = await ReportApi.getReportByForemanId(search, pageIndex, PageSize.ADMIN_REPORT_LIST);
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    getReports();
  }, []);

  const handleSearch = (value) => {
    getReports(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getReports(null, current, false);
  };

  const getActionOrderReports = (record) => {
    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <ViewList />,
        onClick: () => {
          navigate(record?.id);
        },
      },
      {
        key: "UPDATE_DETAIL",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          if (moment().diff(moment(record?.createdDate), "days") >= 1) {
            message.error("Đã quá hạn cập nhật báo cáo!");
          } else {
            setSelectingOrderReport(record);
            setOpenUpdateModal(true);
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.ADMIN_REPORT_LIST}</span>;
      },
    },
    {
      key: "title",
      title: "Tên báo cáo",
      width: "20%",
      render: (_, record) => {
        return record?.title ?? "";
      },
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      key: "reportType",
      title: "Loại báo cáo",
      width: "8%",
      render: (_, record) => {
        let data = ReportTypeMap[record?.reportType];
        return (
          <Tag
            className="text-center"
            color={data?.color}
            style={{ fontWeight: "bold" }}
          >
            {(data ? data?.label : "-")}
          </Tag>
        );
      },
      sorter: (a, b) => a.reportType - (b.reportType),
    },
    {
      key: "reporterName",
      title: "Người báo cáo",
      width: "15%",
      render: (_, record) => {
        return record?.reporterName ?? "";
      },
      sorter: (a, b) => a.reporterName.localeCompare(b.reporterName),
    },
    {
      key: "createdDate",
      title: "Ngày tạo",
      width: "8%",
      render: (_, record) => {
        return record?.createdDate ? formatDate(record?.createdDate, "DD/MM/YYYY") : "";
      },
      sorter: (a, b) => a.createdDate.localeCompare(b.createdDate),
    },
    {
      key: "status",
      title: "Trạng thái",
      width: "10%",
      render: (_, record) => {
        let data = ReportMap[record?.status];
        return <strong className={data?.color}>{data ? data.label : "-"}</strong>;
      },
      sorter: (a, b) => a.status - b.status,
    },
    {
      key: "title",
      title: "Nội dung",
      render: (_, record) => {
        return record?.title ?? "-";
      },
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      key: "action",
      title: "Thao tác",
      width: "7%",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getActionOrderReports(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <BaseTable
        title="Danh sách báo cáo"
        dataSource={reports.data}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.ADMIN_REPORT_LIST,
          total: reports?.total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm tiến độ...",
          onSearch: handleSearch,
          width: 300,
        }}
      />

      <TaskReportUpdateModal
        idOrderReport={selectingOrderReport?.id}
        open={openUpdateModal}
        onCancel={() => setOpenUpdateModal(false)}
        getReports={getReports}
      />
    </>
  );
};
