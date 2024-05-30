export const getCityAddress = ({
	city,
	state,
	country,
}: {
	city: string;
	state?: string | null | undefined;
	country: string;
}) => {
	if (state) {
		return `${city}, ${state}, ${country}`;
	}

	return `${city}, ${country}`;
};

export const getFullAddress = ({
	address,
	city,
	state,
	country,
	zip,
}: {
	address: string;
	city: string;
	state?: string;
	country: string;
	zip?: string;
}) => {
	const cityAddress = getCityAddress({ city, state, country });

	if (zip) {
		return `${address}, ${cityAddress}, ${zip}`;
	}

	return `${address}, ${cityAddress}`;
};
