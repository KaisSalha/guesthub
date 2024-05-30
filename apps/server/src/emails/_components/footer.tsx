import { Hr, Row, Section, Text } from "@react-email/components";

import React from "react";

export const Footer = () => {
	return (
		<Section className='w-full'>
			<Hr />
			<Row>
				<Text className='text-[#B8B8B8] text-xs'>
					GuestHub - 3212-219 Fort York Blvd, Toronto, Canada
				</Text>
			</Row>
		</Section>
	);
};
