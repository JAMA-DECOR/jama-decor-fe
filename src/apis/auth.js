import BaseApi from ".";
import jwt_decode from "jwt-decode";

const login = async (username, password) => {
	try {
		const response = await BaseApi.post("/User/Login", {
			phoneNumber: username,
			password: password,
		});
		if (response.status === 200) {
			const jwt = response.data.result["access_token"];
			const userId = response.data.result["userId"];
			localStorage.setItem("jwt", jwt);
			localStorage.setItem("userId", userId);
			return true;
		}
		return false;
	} catch (error) {
		console.log("Wrong email or password", error);
		return false;
	}
};

const authorize = async () => {
	try {
		const user = jwt_decode(localStorage.getItem("jwt") || '');
		// console.log(user);
		if (!!user && !!user.UserId && (new Date().getTime() < user.exp * 1000)) {
			console.log(new Date().getTime(), user.exp * 1000);
			const userId = localStorage.getItem("userId");
			if (!userId) {
				localStorage.setItem("userId", user.UserId);
			}

			const response = await BaseApi.get("/User/GetById/" + userId);
			return response.data;
		}
		else {
			localStorage.removeItem("jwt");
			localStorage.removeItem("userId");

			return undefined;
		}
	} catch (error) {
		localStorage.removeItem("jwt");
		localStorage.removeItem("userId");
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
	authorize,
	register,
};

export default AuthApi;
