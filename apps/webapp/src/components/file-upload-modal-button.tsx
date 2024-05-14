import React, {
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  forwardRef,
} from "react";
import { Button, ButtonProps } from "@guesthub/ui/button";
import { useUpload } from "@/hooks/use-upload";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@guesthub/ui/dialog";

interface BaseProps {
  multiple: boolean;
  path: string;
  children: React.ReactNode;
  buttonProps?: ButtonProps;
  ruleOfThirds?: boolean;
  circularCrop?: boolean;
  aspect?: number; // Added aspect prop
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

type FileUploadModalButtonProps = ButtonProps &
  (SingleFileUploadProps | MultipleFileUploadProps);

export const FileUploadModalButton = forwardRef<
  HTMLDivElement,
  FileUploadModalButtonProps
>(
  (
    {
      multiple,
      path,
      children,
      buttonProps,
      onFileUploaded,
      onFilesUploaded,
      ruleOfThirds = false,
      circularCrop = false,
      aspect,
    },
    ref
  ) => {
    const { uploadFile, uploadFiles, isPending } = useUpload();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({
      unit: "%",
      x: 25,
      y: 25,
      width: 50,
      height: 50,
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const fileInputKey = useRef<number>(0); // Key to force re-render the file input
    const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

    const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          setSelectedImage(reader.result as string)
        );
        reader.readAsDataURL(e.target.files[0]);
      } else {
        handleClose(); // Close the dialog if no files were selected
      }
    };

    const onLoad = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        imgRef.current = e.currentTarget;
      },
      []
    );

    const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop) => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise<string>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl);
        }, "image/jpeg");
      });
    };

    const handleUpload = async () => {
      if (!imgRef.current || !completedCrop) {
        return;
      }

      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
      if (!croppedImage) {
        return;
      }

      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });

      if (multiple) {
        const urls = await uploadFiles([file], path);
        if (onFilesUploaded) {
          onFilesUploaded(urls.map((url) => `${url}?timestamp=${Date.now()}`)); // Append timestamp to the URL
        }
      } else {
        const url = await uploadFile(file, path);
        if (onFileUploaded) {
          onFileUploaded(`${url}?timestamp=${Date.now()}`); // Append timestamp to the URL
        }
      }

      handleClose();
    };

    const handleClose = () => {
      setSelectedImage(null);
      setCrop({
        unit: "%",
        x: 25,
        y: 25,
        width: 50,
        height: 50,
      });
      setCompletedCrop(null);
      fileInputKey.current += 1; // Force re-render the file input
      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }
    };

    const buttonOnClick = () => {
      const fileInput =
        document.querySelector<HTMLInputElement>(`input[type="file"]`);
      if (fileInput) {
        fileInput.click();
      }
    };

    return (
      <div ref={ref}>
        <input
          key={fileInputKey.current}
          type="file"
          className="hidden"
          multiple={multiple}
          onChange={onSelectFile}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button {...buttonProps} type="button" onClick={buttonOnClick}>
              {children}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose profile picture</DialogTitle>
            </DialogHeader>
            <div>
              {selectedImage && (
                <>
                  <ReactCrop
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    ruleOfThirds={ruleOfThirds}
                    circularCrop={circularCrop}
                    aspect={circularCrop ? 1 : aspect} // Lock aspect ratio if circularCrop is true
                  >
                    <img
                      src={selectedImage}
                      onLoad={onLoad}
                      alt="Crop"
                      style={{ maxWidth: "100%" }}
                    />
                  </ReactCrop>
                  <Button onClick={handleUpload} loading={isPending}>
                    Save
                  </Button>
                </>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleClose} ref={dialogCloseRef}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

FileUploadModalButton.displayName = "FileUploadModalButton";
