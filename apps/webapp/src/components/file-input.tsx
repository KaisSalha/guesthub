import { useRef } from "react";
import { Button, ButtonProps } from "@guesthub/ui/button";

export type FileUploadButtonProps = ButtonProps & {
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
};

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  multiple,
  onFilesSelected,
  children,
  ...buttonProps
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) {
      return;
    }

    if (files.length == 0) {
      return;
    }

    onFilesSelected(Array.from(files));
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
        onChange={fileInputOnChange}
      />
      <Button onClick={buttonOnClick} {...buttonProps} type="button">
        {children}
      </Button>
    </>
  );
};
