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

interface ImageUploadModalButtonProps extends ButtonProps {
  path: string;
  filename: string; // Required filename prop
  children: React.ReactNode;
  buttonProps?: ButtonProps;
  ruleOfThirds?: boolean;
  circularCrop?: boolean;
  aspect?: number; // Added aspect prop
  onFileUploaded: (url: string) => void;
  onFilesUploaded?: never;
}

export const ImageUploadModalButton = forwardRef<
  HTMLDivElement,
  ImageUploadModalButtonProps
>(
  (
    {
      path,
      filename,
      children,
      buttonProps,
      onFileUploaded,
      ruleOfThirds = false,
      circularCrop = false,
      aspect,
    },
    ref
  ) => {
    const { uploadFile, isPending } = useUpload();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string>("image/jpeg"); // State to store the file type
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
        const file = e.target.files[0];
        setFileType(file.type); // Set the file type
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          setSelectedImage(reader.result as string)
        );
        reader.readAsDataURL(file);
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
        }, fileType);
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
      const file = new File([blob], filename, { type: fileType });

      const url = await uploadFile(file, path);
      if (onFileUploaded) {
        onFileUploaded(`${url}`); // Append timestamp to the URL
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
                </>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={handleClose}
                  ref={dialogCloseRef}
                  variant="ghost"
                >
                  Cancel
                </Button>
              </DialogClose>
              {selectedImage && (
                <Button onClick={handleUpload} loading={isPending}>
                  Save
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

ImageUploadModalButton.displayName = "ImageUploadModalButton";
