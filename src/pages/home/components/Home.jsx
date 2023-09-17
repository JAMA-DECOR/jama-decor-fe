import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Card, Dropdown, Tag, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import RoleApi from "../../../apis/role";
import UserApi from "../../../apis/user";
import { BaseTable } from "../../../components/BaseTable";
import { roles } from "../../../constants/app";
import { getRoleName } from "../../../utils";
import Title from "antd/es/typography/Title";

const Home = () => {
  const [accountLoading, setAccountLoading] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const userRef = useRef();
  const rolesRef = useRef();

  const getUsers = async (keyword) => {
    setAccountLoading(true);
    const data = await UserApi.searchUsers(keyword);
    data.sort((a, b) => {
      if (a.role === roles.ADMIN) {
        return -1; // a comes before b
      }
      if (b.role === roles.ADMIN) {
        return 1; // b comes before a
      }
      return 0; // no change in order
    });
    setAccounts(data);
    setAccountLoading(false);
  };

  const getAllRoles = async () => {
    const result = await RoleApi.getAllRoles();
    rolesRef.current = result.filter((e) => e.name !== roles.ADMIN);
  };

  useEffect(() => {
    getUsers();
    getAllRoles();
  }, []);

  return (
    <>
      <Card >
        <Title>HOME</Title>
      </Card>
    </>
  );
};

export default Home;
