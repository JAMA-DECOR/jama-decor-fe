import { createBrowserRouter } from "react-router-dom";
import routes from "../constants/routes";
import { LoginPage } from "../pages/login";
import { RegisterAccountPage } from "../pages/register";
import { Dashboard } from "../layouts/dashboard";
import { AccountListPage } from "../pages/account/list";
import { CourseListPage } from "../pages/course/list";
import { CourseDetailPage } from "../pages/course/detail";
import RootRoute from "./RootRoute";
import PageNotFound from "../pages/error/404";
import ProjectListPage from "../pages/project/list";
import ProjectDetailPage from "../pages/project/detail";
import ProfilePage from "../pages/profile";
import ClassListPage from "../pages/class/list";
import ClassDetailPage from "../pages/class/detail";
import { TeamListPage } from "../pages/team/list";
import ProjectReportListPage from "../pages/report/list";
import SemesterListPage from "../pages/semester/list";
import SemesterDetailPage from "../pages/semester/detail";
import TeamDetailPage from "../pages/team/detail";
import StudentTeamReportPage from "../pages/report/student";
import ProjectReportDetailPage from "../pages/report/detail";

export const router = createBrowserRouter([
	{
		path: routes.root,
		element: <RootRoute />,
		errorElement: <PageNotFound />,
		children: [
			{
				path: routes.login,
				element: <LoginPage />,
			},
			{
				path: routes.register,
				element: <RegisterAccountPage />,
			},
			{
				path: routes.dashboard.root,
				element: <Dashboard />,
				children: [
					{
						path: routes.dashboard.accounts,
						element: <AccountListPage />,
					},

					{
						path: routes.dashboard.courses,
						element: <CourseListPage />,
					},
					{
						path: `${routes.dashboard.courses}/:id`,
						element: <CourseDetailPage />,
					},
					{
						path: routes.dashboard.projects,
						element: <ProjectListPage />,
					},
					{
						path: `${routes.dashboard.projects}/:id`,
						element: <ProjectDetailPage />,
					},
					{
						path: routes.dashboard.profile,
						element: <ProfilePage />,
					},
					{
						path: routes.dashboard.classes,
						element: <ClassListPage />,
					},
					{
						path: `${routes.dashboard.classes}/:id`,
						element: <ClassDetailPage />,
					},
					{
						path: routes.dashboard.teamRequest,
						element: <TeamListPage />,
					},
					{
						path: routes.dashboard.report,
						element: <ProjectReportListPage />,
					},
					{
						path: `${routes.dashboard.report}/:id`,
						element: <ProjectReportDetailPage />,
					},
					{
						path: routes.dashboard.semester,
						element: <SemesterListPage />,
					},
					{
						path: `${routes.dashboard.semester}/:id`,
						element: <SemesterDetailPage />,
					},
					{
						path: routes.dashboard.teams,
						element: <TeamListPage />,
					},
					{
						path: `${routes.dashboard.teams}/:id`,
						element: <TeamDetailPage />,
					},
					{
						path: `${routes.dashboard.studentReport}/:id`,
						element: <StudentTeamReportPage />,
					},
				],
			},
		],
	},
]);
