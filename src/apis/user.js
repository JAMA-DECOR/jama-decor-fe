import { message } from "antd";
import BaseApi from ".";

const resource = "User";

export const searchUsers = async (keyword) => {
	try {
		let params = {};
		if (keyword) {
			params = { ...params, keyword };
			const response = await BaseApi.get(`/${resource}`, { params: params });
			return response.data;
		}
	} catch (error) {
		console.log("Error search users: ", error);
		return [];
	}
};

const getUserById = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetById/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error get user by id: ", error);
		return false;
	}
};

const getUserByRoleId = async (role) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetByRoleId/${role}`);
		console.log(response)
		return response.data;
	} catch (error) {
		console.log("Error get user by role: ", error);
		return false;
	}
};

const getAllUser = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAll`);
		return response.data;
	} catch (error) {
		console.log("Error get user by role: ", error);
		return false;
	}
};
export const getAll = async (keyword) => {
	try {
		if (!!keyword) {
			return searchUsers(keyword);
		}
		else {
			const response = await BaseApi.get(`/${resource}/GetAll`);
			return response.data.data;
		}
	} catch (error) {
		console.log("Error search users: ", error);
		return [];
	}
};

const GetAllWithSearchAndPaging = async (search, pageIndex, pageSize) => {
	try {
		if (search) {
			return await searchGetAllWithSearchAndPaging(search, pageIndex, pageSize);
		}
		else {
			var params = {};
			if (pageIndex) {
				params = { ...params, pageIndex };
			}
			if (pageSize) {
				params = { ...params, pageSize };
			}
			const response = await BaseApi.get(`/${resource}/GetAllWithSearchAndPaging`, {
				params: params,
			});
			return response.data;
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return false;
	}
};

const searchGetAllWithSearchAndPaging = async (search, pageIndex, pageSize) => {
	try {
		var params = {};
		if (search) {
			params = { ...params, search };
		}
		if (pageIndex) {
			params = { ...params, pageIndex };
		}
		if (pageSize) {
			params = { ...params, pageSize };
		}
		const response = await BaseApi.get(`/${resource}/GetAllWithSearchAndPaging`, {
			params: params,
		});
		return response.data;
	} catch (error) {
		console.log("Error get group: ", error);
		return false;
	}
};

const getUserByEmail = async (email) => {
	try {
		const response = await BaseApi.get(`/${resource}/${email}`);
		return response.data;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const getUserRole = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetUserRole/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};


const createUser = async (role, user) => {
	try {
		const response = await BaseApi.post(`/${resource}/Create${role}`, user);
		return response.data;
	} catch (error) {
		console.log("Error ban user: ", error);
		return error?.response?.data || null;
	}
};

const banUser = async (id) => {
	try {
		const response = await BaseApi.put(`/${resource}/BanUser/${id}`);
		return response;
	} catch (error) {
		console.log("Error ban user: ", error);
		return null;
	}
};

const unbanUser = async (id) => {
	try {
		const response = await BaseApi.put(`/${resource}/UnBanUser/${id}`);
		return response;
	} catch (error) {
		console.log("Error unban user: ", error);
		return null;
	}
};

const updateUserRole = async (userId, roleId) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateRole`, {
			userId,
			roleId,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error update user role: ", error);
		return false;
	}
};

const updateUserPhone = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdatePhone`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update user phone: ", error);
		return false;
	}
};

const updateUserInfo = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/Update`, data);
		return response.data;
	} catch (error) {
		console.log("Error update user role: ", error);
		return error?.response?.data || null;
	}
};

const getByForemanRole = async (search, pageIndex, pageSize) => {
	try {
		if (search) {
			return await searchGetByForemanRole(search, pageIndex, pageSize);
		}
		else {
			var params = {};
			if (pageIndex) {
				params = { ...params, pageIndex };
			}
			if (pageSize) {
				params = { ...params, pageSize };
			}
			const response = await BaseApi.get(`/${resource}/GetByForemanRole`, {
				params: params,
			});
			return response.data;
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return false;
	}
};

const searchGetByForemanRole = async (search, pageIndex, pageSize) => {
	try {
		var params = {};
		if (search) {
			params = { ...params, search };
		}
		if (pageIndex) {
			params = { ...params, pageIndex };
		}
		if (pageSize) {
			params = { ...params, pageSize };
		}
		const response = await BaseApi.get(`/${resource}/GetByForemanRole`, {
			params: params,
		});
		return response;
	} catch (error) {
		console.log("Error get group: ", error);
		return false;
	}
};

const getByLeaderRole = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetByLeaderRole`)
		return response.data;
	} catch (error) {
		console.log("Error enroll group: ", error);
		return false;
	}
};

const getByLeaderRoleAndWorkerRole = async (search, pageIndex, pageSize) => {
	try {
		if (search) {
			return await searchGetByLeaderRoleAndWorkerRole(search, pageIndex, pageSize);
		}
		else {
			var params = {};
			if (pageIndex) {
				params = { ...params, pageIndex };
			}
			if (pageSize) {
				params = { ...params, pageSize };
			}
			const response = await BaseApi.get(`/${resource}/GetByLeaderRoleAndWorkerRole`, {
				params: params,
			});
			return response.data;
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return false;
	}
};

const searchGetByLeaderRoleAndWorkerRole = async (search, pageIndex, pageSize) => {
	try {
		var params = {};
		if (search) {
			params = { ...params, search };
		}
		if (pageIndex) {
			params = { ...params, pageIndex };
		}
		if (pageSize) {
			params = { ...params, pageSize };
		}
		const response = await BaseApi.get(`/${resource}/GetByLeaderRoleAndWorkerRole`, {
			params: params,
		});
		return response.data;
	} catch (error) {
		console.log("Error get group: ", error);
		return false;
	}
};

const getRoleLeaderAndWorker = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetRoleLeaderAndWorker`);
		return response.data;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const changePassword = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/ChangePassword`, data);
		return response.data;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const resetPassword = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/ResetPassword`, data);
		return response.data;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const UserApi = {
	searchUsers,
	banUser,
	unbanUser,
	createUser,
	updateUserRole,
	updateUserInfo,
	getUserById,
	getUserByRoleId,
	getAllUser,
	getUserByEmail,
	getUserRole,
	updateUserPhone,
	getAll,
	GetAllWithSearchAndPaging,
	getByForemanRole,
	getByLeaderRole,
	getByLeaderRoleAndWorkerRole,
	getRoleLeaderAndWorker,
	changePassword,
	resetPassword,
};

export default UserApi;
