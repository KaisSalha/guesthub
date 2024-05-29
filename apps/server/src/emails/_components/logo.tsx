import React from "react";
import { Img } from "@react-email/components";

export const Logo = () => {
	return (
		<Img
			src={`https://guesthubai.s3.ca-central-1.amazonaws.com/public/logo.png`}
			width='45'
			height='45'
			alt='GuestHub'
			className='my-0 mx-auto block'
		/>
	);
};
