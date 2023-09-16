import BaseApi from ".";

const resource = "Role";

const getAllRoles = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAllRoles`);
		return response.data;
	} catch (error) {
		console.log("Error get all roles: ", error);
		return [];
	}
};

const RoleApi = { getAllRoles };

export default RoleApi;
