const routes = {
	root: "/",
	login: "/login",
	register: "/register",
	dashboard: {
		root: "/dashboard",
		home: "home",
		profile: "profile",
		accounts: "accounts",
		orders: "orders",
		quotes: "quotes",
		// old
		courses: "courses",
		classes: "classes",
		projects: "projects",
		teams: "teams",
		teamRequest: "team-requests",
		report: "team-report",
		semester: "semester",
		studentReport: "student-report",
		statistics: "statistics",
	},
};

export const UnauthorizedRoutes = [routes.login, routes.register];

export default routes;
