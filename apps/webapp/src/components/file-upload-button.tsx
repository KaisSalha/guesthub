import React, { ChangeEvent, useRef } from "react";
import { Button, ButtonProps } from "@guesthub/ui/button";
import { useUpload } from "@/hooks/use-upload";

interface BaseProps {
  multiple: boolean;
  children: React.ReactNode;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  path: string;
  access?: "public" | "private";
}

interface SingleFileUploadProps extends BaseProps {
  multiple: false;
  onFileUploaded: (url: string) => void;
  onFilesUploaded?: never;
}

interface MultipleFileUploadProps extends BaseProps {
  multiple: true;
  onFileUploaded?: never;
  onFilesUploaded: (urls: string[]) => void;
}

type FileUploadButtonProps = ButtonProps &
  (SingleFileUploadProps | MultipleFileUploadProps);

export const FileUploadButton = (props: FileUploadButtonProps) => {
  const { multiple, children, buttonProps, path, access = "private" } = props;
  const { uploadFile, uploadFiles, isPending } = useUpload();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (multiple) {
        const urls = await uploadFiles({
          files: Array.from(files),
          path,
          access,
        });
        if (props.onFilesUploaded) {
          props.onFilesUploaded(urls);
        }
      } else {
        const file = files[0];
        const url = await uploadFile({ file, path, access });
        if (props.onFileUploaded) {
          props.onFileUploaded(url);
        }
      }
    }
  };

  const buttonOnClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        multiple={multiple}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        onClick={buttonOnClick}
        {...buttonProps}
        loading={isPending}
        type="button"
      >
        {children}
      </Button>
    </>
  );
};
