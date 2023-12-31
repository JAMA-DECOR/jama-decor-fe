import { Layout, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { AppSider } from "./Sider";
import { AppHeader } from "./Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import Lottie from "react-lottie";
import animationData from "../../assets/lotties/home-animation";
import AuthApi from "../../apis/auth";
import { UserContext } from "../../providers/user";
import { getRoleName } from "../../utils";
import { roles } from "../../constants/app";
const { Content } = Layout;
const { Title } = Typography;

export const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    AuthApi.authorize()
      .then((user) => {
        if (!user) {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          navigate(routes.login);
          return;
        }
        document.title = `${getRoleName(user.role.name)} | Dashboard`;
        setUser(user);
        var path = routes.dashboard.home;

        if (user.role.name === roles.WORKER) {
          path = routes.dashboard.tasks;
        }
        navigate(path);
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <Layout hasSider>
        <AppSider />
        <Layout>
          <AppHeader />
          <Layout>
            <Content
              style={{
                padding: 16,
                paddingRight: 32,
                overflow: "initial",
                backgroundColor: "white",
              }}
            >
              {location.pathname === routes.dashboard.root && (
                <div className="w-full h-[60vh] flex-center" style={{ flexDirection: "column" }}>
                  {/* <Title level={3}>JAMA Decor</Title> */}
                  <Lottie
                    width="30%"
                    options={{
                      animationData: animationData,
                      autoplay: true,
                      loop: true,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                  />
                  <Title level={4}>Coming Soon</Title>
                </div>
              )}
              <Outlet />
            </Content>
            {/* <ActivitySider /> */}
          </Layout>
        </Layout>
      </Layout>
    </UserContext.Provider>
  );
};
