import BaseApi from ".";
import { mockAccounts } from "../__mocks__/accounts";

const resource = "User";

export const searchUsers = async (keyword) => {
	try {
		// const query = keyword ? `?search=${keyword}` : "";
		let params = {};
		if (keyword) params = { ...params, keyword };
		const response = await BaseApi.get(`/${resource}`, { params: params });
		return response.data;
		// return mockAccounts;
	} catch (error) {
		console.log("Error search users: ", error);
		return [];
	}
};

const banUser = async (userId) => {
	try {
		const response = await BaseApi.put(`/${resource}/BanUser/${userId}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const unbanUser = async (userId) => {
	try {
		const response = await BaseApi.put(`/${resource}/UnbanUser/${userId}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error unban user: ", error);
		return false;
	}
};

const updateUserRole = async (userId, roleId) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateUserRole`, {
			userId,
			roleId,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error update user role: ", error);
		return false;
	}
};

const UserApi = {
	searchUsers,
	banUser,
	unbanUser,
	updateUserRole,
};

export default UserApi;
