import moment from "moment/moment";
import { roles } from "../constants/app";
import routes from "../constants/routes";

export const formatDate = (date, pattern) => {
	const result = moment(date).format(pattern);
	return result;
};

export const getRoleName = (role) => {
	switch (role) {
		case roles.ADMIN:
			return "Admin";
		case roles.WORKER:
			return "Sinh viên";
		case roles.FACTORY:
			return "Giáo viên";
		default:
			return "";
	}
};

export const getTitle = (route) => {
	switch (route) {
		case routes.dashboard.home:
			return "Bảng điều khiển";
		case routes.dashboard.profile:
			return "Thông tin cá nhân";
		case routes.dashboard.statistics:
			return "Thống kê";
		default:
			return "";
	}
};