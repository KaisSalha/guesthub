import { Hr, Link, Row, Section, Text } from "@react-email/components";

import React from "react";
import { Logo } from "./logo.js";

type Props = {
	unsubscribeLink?: string;
};

export const Footer = ({ unsubscribeLink }: Props) => {
	return (
		<Section className='w-full'>
			<Hr />

			<br />

			<Text className='text-[21px] font-regular'>
				Run your business smarter.
			</Text>

			<br />

			<Section className='text-left p-0 m-0'>
				<Row>
					<Text className='font-medium'>Product</Text>
				</Row>
				<Row className='mb-1.5'>
					<Link
						className='text-[#707070] text-[14px]'
						href='https://go.midday.ai/fhEy5CL'
					>
						Homepage
					</Link>
				</Row>
				<Row className='mb-1.5'>
					<Link
						className='text-[#707070] text-[14px]'
						href='https://go.midday.ai/KKEB90F'
					>
						Pricing
					</Link>
				</Row>
				<Row className='mb-1.5'>
					<Link
						className='text-[#707070] text-[14px]'
						href='https://go.midday.ai/Wa3TxOy'
					>
						Story
					</Link>
				</Row>
				<Row className='mb-1.5'>
					<Link
						className='text-[#707070] text-[14px]'
						href='https://go.midday.ai/jr5dX4W'
					>
						Updates
					</Link>
				</Row>
				<Row className='mb-1.5'>
					<Link
						className='text-[#707070] text-[14px]'
						href='https://go.midday.ai/sXJM9Qv'
					>
						Download
					</Link>
				</Row>

				<Row className='mb-1.5'>
					<Link
						className='text-[#707070] text-[14px]'
						href='https://midday.ai/feature-request'
					>
						Feature Request
					</Link>
				</Row>
			</Section>

			<br />
			<br />

			<Row>
				<Text className='text-[#B8B8B8] text-xs'>
					Midday Labs AB - Torsgatan 59 113 37, Stockholm, Sweden.
				</Text>
			</Row>

			{unsubscribeLink && (
				<Row>
					<Link
						className='text-[#707070] text-[14px]'
						href={unsubscribeLink}
						title='Unsubscribe'
					>
						Unsubscribe
					</Link>
				</Row>
			)}

			{!unsubscribeLink && (
				<Row>
					<Link
						className='text-[#707070] text-[14px]'
						href='https://app.midday.ai/settings/notifications'
						title='Unsubscribe'
					>
						Notification preferences
					</Link>
				</Row>
			)}

			<br />
			<br />

			<Row>
				<Link href='https://go.midday.ai/FZwOHud'>
					<Logo />
				</Link>
			</Row>
		</Section>
	);
};
