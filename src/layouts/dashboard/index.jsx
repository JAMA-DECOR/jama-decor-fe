import { Layout, Space, Spin, Typography } from "antd";
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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    setLoading(true);
    AuthApi.authorize()
      .then((user) => {
        if (!user) {
          navigate(routes.login);
          return;
        } else {
          document.title = `${getRoleName(user.role.name)} | Dashboard`;
          setUser(user);
          var path = routes.dashboard.home;

          if (user.role.name === roles.WORKER) {
            path = routes.dashboard.tasks;
          }
          navigate(path);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <Spin spinning={loading} style={{ minHeight: "100vh !important" }}>
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
      </Spin>
    </UserContext.Provider>
  );
};
