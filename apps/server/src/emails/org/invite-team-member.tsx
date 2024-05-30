import {
	Body,
	Button,
	Container,
	Font,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";
import { Logo } from "../_components/logo.js";

interface InviteEmailProps {
	email: string;
	invitedByEmail: string;
	invitedByName: string;
	teamName: string;
	inviteCode: string;
	location: string;
}

const baseAppUrl =
	process.env.NODE_ENV === "production"
		? "https://guesthub.ai"
		: "https://guesthub.internal:3001";

export const InviteEmail = ({
	invitedByEmail = "bukinoshita@example.com",
	invitedByName = "Pontus Abrahamsson",
	email = "pontus@lostisland.co",
	teamName = "Acme Co",
	inviteCode = "jnwe9203frnwefl239jweflasn1230oqef",
	location = "São Paulo, Brazil",
}: InviteEmailProps) => {
	const inviteLink = `${baseAppUrl}/teams/invite/${inviteCode}`;

	return (
		<Html>
			<Tailwind>
				<head>
					<Font
						fontFamily='Geist'
						fallbackFontFamily='Helvetica'
						webFont={{
							url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
							format: "woff2",
						}}
						fontWeight={400}
						fontStyle='normal'
					/>

					<Font
						fontFamily='Geist'
						fallbackFontFamily='Helvetica'
						webFont={{
							url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
							format: "woff2",
						}}
						fontWeight={500}
						fontStyle='normal'
					/>
				</head>
				<Preview>Join {teamName} on GuestHub</Preview>

				<Body className='bg-[#fff] my-auto mx-auto font-sans'>
					<Container
						className='border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]'
						style={{ borderStyle: "solid", borderWidth: 1 }}
					>
						<Logo />
						<Heading className='mx-0 my-[30px] p-0 text-[24px] font-normal text-[#121212] text-center'>
							Join <strong>{teamName}</strong> on{" "}
							<strong>GuestHub</strong>
						</Heading>

						<Text className='text-[14px] leading-[24px] text-[#121212]'>
							{invitedByName} (
							<Link
								href={`mailto:${invitedByEmail}`}
								className='text-[#121212] no-underline'
							>
								{invitedByEmail}
							</Link>
							) has invited you to the <strong>{teamName}</strong>{" "}
							team on <strong>GuestHub</strong>.
						</Text>
						<Section className='mb-[42px] mt-[32px] text-center'>
							<Button
								className='bg-transparent rounded-md text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]'
								href={inviteLink}
							>
								Join the team
							</Button>
						</Section>

						<Text className='text-[14px] leading-[24px] text-[#707070] break-all'>
							or copy and paste this URL into your browser:{" "}
							<Link
								href={inviteLink}
								className='text-[#707070] underline'
							>
								{inviteLink}
							</Link>
						</Text>

						<br />
						<Section>
							<Text className='text-[12px] leading-[24px] text-[#666666]'>
								This invitation was intended for{" "}
								<span className='text-[#121212] '>{email}</span>
								. This invite was sent by{" "}
								<span className='text-[#121212] '>
									{invitedByName}
								</span>{" "}
								located in{" "}
								<span className='text-[#121212] '>
									{location}
								</span>
								. If you were not expecting this invitation, you
								can ignore this email. If you are concerned
								about your account's safety, please reply to
								this email to get in touch with us.
							</Text>
						</Section>

						<br />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default InviteEmail;
