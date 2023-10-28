import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import routes, { UnauthorizedRoutes } from "../constants/routes";

const RootRoute = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const isAuthenticated = useAuth();

	useEffect(() => {
		const path = pathname;
		
		// check if the path is needed to authorize
		if (!UnauthorizedRoutes.includes(path)) {
			if (!isAuthenticated) {
				navigate(routes.login);
			} else {
				if (path === routes.root) {
					navigate(routes.dashboard.home);
				}
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname, isAuthenticated]);

	return <Outlet />;
};

export default RootRoute;
