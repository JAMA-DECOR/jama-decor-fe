
export const useAuth = () => {
	return !!localStorage?.getItem("jwt") && !!localStorage?.getItem("userId");
};
