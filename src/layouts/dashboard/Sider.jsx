import { DegreeHat, User, Classroom, Analysis, Hourglass, EveryUser } from "@icon-park/react";
import { Menu, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import { usePermissions } from "../../hooks/permission";
import { ALL_PERMISSIONS, logoUrl } from "../../constants/app";
import { DashboardOutlined, FileDoneOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const AppSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = usePermissions();

  const canViewAccount = permissions?.includes(ALL_PERMISSIONS.account.sider);
  const canViewCourse = permissions?.includes(ALL_PERMISSIONS.course.sider);
  const canViewClass = permissions?.includes(ALL_PERMISSIONS.class.sider);
  const canViewTeam = permissions?.includes(ALL_PERMISSIONS.team.sider);
  const canViewReport = permissions?.includes(ALL_PERMISSIONS.report.sider);
  const canViewSemester = permissions?.includes(ALL_PERMISSIONS.semester.sider);

  const itemKeys = {
    DASHBOARD: "DASHBOARD",
    ACCOUNT: "MANAGE_ACCOUNT",
    ORDER: "MANAGE_ORDER",
    QUOTE: "MANAGE_QUOTE",
  };
  const iconSize = 20;
  const items = [
    {
      key: itemKeys.DASHBOARD,
      icon: <DashboardOutlined size={iconSize} />,
      label: <Link to={routes.dashboard.home}>Bảng điều khiển</Link>,
    },
    {
      key: itemKeys.ACCOUNT,
      icon: <UserOutlined size={iconSize} />,
      label: <Link to={routes.dashboard.accounts}>Quản lý tài khoản</Link>,
    },
    {
      key: itemKeys.ORDER,
      icon: <FormOutlined size={iconSize} />,
      label: <Link to={routes.dashboard.root}>Đơn đặt hàng</Link>,
    },
    {
      key: itemKeys.QUOTE,
      icon: <FileDoneOutlined size={iconSize} />,
      label: <Link to={routes.dashboard.root}>Duyệt báo giá</Link>,
    },
    // canViewAccount && {
    //   key: itemKeys.ACCOUNT,
    //   icon: <User size={iconSize} />,
    //   label: <Link to={routes.dashboard.accounts}>Tài khoản</Link>,
    // },
    // canViewCourse && {
    //   key: itemKeys.COURSE,
    //   icon: <DegreeHat size={iconSize} />,
    //   label: <Link to={routes.dashboard.courses}>Môn học</Link>,
    // },
    // canViewSemester && {
    //   key: itemKeys.SEMESTER,
    //   icon: <Hourglass size={iconSize} />,
    //   label: <Link to={routes.dashboard.semester}>Học kỳ</Link>,
    // },
    // canViewClass && {
    //   key: itemKeys.CLASS,
    //   icon: <Classroom size={iconSize} />,
    //   label: <Link to={routes.dashboard.classes}>Lớp học</Link>,
    // },
    // canViewTeam && {
    //   key: itemKeys.TEAM,
    //   icon: <EveryUser size={iconSize} />,
    //   label: <Link to={routes.dashboard.teams}>Nhóm của tôi</Link>,
    // },
    // canViewReport && {
    //   key: itemKeys.REPORT,
    //   icon: <Analysis size={iconSize} />,
    //   label: <Link to={routes.dashboard.report}>Báo cáo nhóm</Link>,
    // },
  ];

  const getSelectedKey = () => {
    const paths = location.pathname.split("/").filter((e) => e);
    const dashboard = routes.dashboard.root.slice(1);
    if (paths[0] !== dashboard) {
      return undefined;
    }

    switch (paths[1]) {
      case routes.dashboard.home:
        return itemKeys.DASHBOARD;
      case routes.dashboard.accounts:
        return itemKeys.ACCOUNT;
      case routes.dashboard.orders:
        return itemKeys.ORDER;
      case routes.dashboard.quotes:
        return itemKeys.QUOTE;
      // case routes.dashboard.classes:
      //   return itemKeys.CLASS;
      // case routes.dashboard.teamRequest:
      //   return itemKeys.TEAM_REQUEST;
      // case routes.dashboard.report:
      //   return itemKeys.REPORT;
      // case routes.dashboard.semester:
      //   return itemKeys.SEMESTER;
      // case routes.dashboard.teams:
      //   return itemKeys.TEAM;
      default:
    }

    return undefined;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      className="dashboard-sider pb-8 h-[100vh] !border-x-2 !border-gray-600"
    >
      <Link
        to={routes.dashboard.home}
        className={`flex-center mb-4 duration-500 ${collapsed ? "h-[60px]" : "h-[120px]"}`}
      >
        <img src={logoUrl} height={collapsed ? 40 : 100} className="duration-300" />
      </Link>
      <Menu
        theme="light"
        mode="inline"
        style={{ border: "none" }}
        defaultSelectedKeys={[itemKeys.DASHBOARD]}
        selectedKeys={[getSelectedKey()]}
        items={items}
      />
    </Sider>
  );
};
