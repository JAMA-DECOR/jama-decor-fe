import BaseApi from ".";
import { mockAccounts } from "../__mocks__/accounts";

const login = async (username, password) => {
	try {
		// // local
		// let user = mockAccounts.find((item) => (item.email === username || item.username === username) && item.password === password)
		// if (!!user) {
		// 	localStorage.setItem("user", JSON.stringify(user));
		// 	return true
		// }
		const response = await BaseApi.post("/User/Login", {
			phoneNumber: username,
			password: password,
		});
		if (response.status === 200) {
			const jwt = response.data.result["access_token"];
			const userID = response.data.result["userID"];
			localStorage.setItem("jwt", jwt);
			localStorage.setItem("userID", userID);
			return true;
		}
		return false
	} catch (error) {
		console.log("Wrong email or password", error);
		return false;
	}
};

const getUser = async () => {
	try {
		const userID = localStorage.getItem("userID");
		const response = await BaseApi.get("/User/GetById/" + userID);
		return response.data;
		// const user = JSON.parse(localStorage.getItem("user")) || {};
		// return user
	} catch (error) {
		console.log("Error get user: ", error);
		return undefined;
	}
};

const register = async (email, fullName, password, roleId) => {
	const response = await BaseApi.post("/User/Register", {
		email: email,
		fullName: fullName,
		password: password,
		roleId: roleId,
	});
	return response.status === 200;
};

const AuthApi = {
	login,
	getUser,
	register,
};

export default AuthApi;
