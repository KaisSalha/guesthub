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

const getPresignedUploadUrl = async (
  filename: string,
  contentType: string,
  path: string
): Promise<PresignedUrlResponse> => {
  const response = await axios.post<PresignedUrlResponse>(
    `${import.meta.env.VITE_API_ENDPOINT}/generate-file-upload-presigned-url`,
    { filename, contentType, path },
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
    mutationFn: async ({ file, path }: { file: File; path: string }) => {
      const presignedUrl = await getPresignedUploadUrl(
        file.name,
        file.type,
        path
      );

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
    mutationFn: async ({ file, path }: { file: File; path: string }) => {
      const presignedUrl = await getPresignedUploadUrl(
        file.name,
        file.type,
        path
      );

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
  const uploadFile = async (file: File, path: string) => {
    setProgress(0);
    const url = await singleFileMutation.mutateAsync({ file, path });
    return url; // Return the URL
  };

  // Function to upload multiple files
  const uploadFiles = async (files: File[], path: string) => {
    const initialFilesProgress = files.map((file) => ({
      file,
      progress: 0,
      url: "",
    }));
    setFilesProgress(initialFilesProgress);

    const urls = await Promise.all(
      files.map((file) => multipleFilesMutation.mutateAsync({ file, path }))
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
