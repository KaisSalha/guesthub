// capitalize first letter of string
export const capitalize = (str: string | undefined) => {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};
