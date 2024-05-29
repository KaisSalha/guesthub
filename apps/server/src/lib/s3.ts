import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/index.js";

const s3Client = new S3Client({
	region: config.S3.REGION,
	credentials: {
		accessKeyId: config.S3.ACCESS_KEY,
		secretAccessKey: config.S3.SECRET_KEY,
	},
});

export const generateFileUploadPresignedUrl = async ({
	file_name,
	file_type,
	path,
}: {
	file_name: string;
	file_type: string;
	path: string;
}) => {
	const command = new PutObjectCommand({
		Bucket: config.S3.BUCKET_NAME,
		Key: `${path}/${file_name}`,
		ContentType: file_type,
	});

	return await getSignedUrl(s3Client, command, {
		expiresIn: 3600,
	});
};

export const fileURL = ({
	file_name,
	path,
}: {
	file_name: string;
	path: string;
}) => {
	return `https://${config.S3.BUCKET_NAME}.s3.${config.S3.REGION}.amazonaws.com/${path}/${file_name}`;
};

export const publicFileURL = ({ file_name }: { file_name: string }) => {
	return fileURL({ file_name, path: "public" });
};
