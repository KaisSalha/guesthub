import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface PresignedUrlResponse {
  url: string;
  readUrl: string;
}

interface FileUploadProgress {
  file: File;
  progress: number;
  url: string;
}

const getPresignedUploadUrl = async ({
  filename,
  contentType,
  path,
  access,
}: {
  filename: string;
  contentType: string;
  path: string;
  access?: "public" | "private";
}): Promise<PresignedUrlResponse> => {
  const response = await axios.post<PresignedUrlResponse>(
    `${import.meta.env.VITE_API_ENDPOINT}/generate-file-upload-presigned-url`,
    { filename, contentType, path, access },
    {
      withCredentials: true,
    }
  );

  return {
    url: response.data.url,
    readUrl: response.data.readUrl,
  };
};

export const useUpload = () => {
  // State for single file upload
  const [progress, setProgress] = useState<number>(0);

  // State for multiple file uploads
  const [filesProgress, setFilesProgress] = useState<FileUploadProgress[]>([]);

  // Mutation for single file upload
  const singleFileMutation = useMutation({
    mutationFn: async ({
      file,
      path,
      access,
    }: {
      file: File;
      path: string;
      access?: "public" | "private";
    }) => {
      const presignedUrl = await getPresignedUploadUrl({
        filename: file.name,
        contentType: file.type,
        path,
        access,
      });

      await axios.put(presignedUrl.url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

      return presignedUrl.readUrl;
    },
  });

  // Mutation for multiple file uploads
  const multipleFilesMutation = useMutation({
    mutationFn: async ({
      file,
      path,
      access,
    }: {
      file: File;
      path: string;
      access?: "public" | "private";
    }) => {
      const presignedUrl = await getPresignedUploadUrl({
        filename: file.name,
        contentType: file.type,
        path,
        access,
      });

      await axios.put(presignedUrl.url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (event) => {
          if (event.total) {
            setFilesProgress((prev) =>
              prev.map((fp) =>
                fp.file === file
                  ? {
                      ...fp,
                      progress: Math.round((event.loaded * 100) / event.total!),
                    }
                  : fp
              )
            );
          }
        },
      });

      return presignedUrl.readUrl;
    },
  });

  // Function to upload a single file
  const uploadFile = async ({
    file,
    path,
    access,
  }: {
    file: File;
    path: string;
    access?: "public" | "private";
  }) => {
    setProgress(0);
    const url = await singleFileMutation.mutateAsync({ file, path, access });
    return url; // Return the URL
  };

  // Function to upload multiple files
  const uploadFiles = async ({
    files,
    path,
    access,
  }: {
    files: File[];
    path: string;
    access?: "public" | "private";
  }) => {
    const initialFilesProgress = files.map((file) => ({
      file,
      progress: 0,
      url: "",
    }));
    setFilesProgress(initialFilesProgress);

    const urls = await Promise.all(
      files.map((file) =>
        multipleFilesMutation.mutateAsync({ file, path, access })
      )
    );
    return urls; // Return the URLs
  };

  return {
    uploadFile,
    progress,
    uploadFiles,
    filesProgress,
    isPending: singleFileMutation.isPending || multipleFilesMutation.isPending,
  };
};
