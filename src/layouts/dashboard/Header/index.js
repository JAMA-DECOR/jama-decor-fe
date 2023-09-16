import { Header } from "antd/es/layout/layout";
import { Typography } from "antd";
import React from "react";
import { ProfileBar } from "./Profile";
import { useNavigate } from "react-router-dom";
import routes from "../../../constants/routes";

const { Title } = Typography;

export const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Title
        style={{ color: "white" }}
        level={4}
        className="cursor-pointer"
        onClick={() => navigate(routes.dashboard.root)}
      >
        SWP Projects On-going Report System
      </Title>
      <ProfileBar />
    </Header>
  );
};
