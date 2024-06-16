import React, {
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  forwardRef,
  useEffect,
} from "react";
import { Button } from "@guesthub/ui/button";
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

interface ImageUploadModalProps {
  title: string;
  path: string;
  filename: string;
  children: React.ReactNode;
  ruleOfThirds?: boolean;
  circularCrop?: boolean;
  aspect?: number;
  className?: string;
  access?: "public" | "private";
  onFileUploaded: (url: string) => void;
}

export const ImageUploadModal = forwardRef<
  HTMLDivElement,
  ImageUploadModalProps
>(
  (
    {
      title,
      path,
      filename,
      children,
      onFileUploaded,
      ruleOfThirds = false,
      circularCrop = false,
      aspect,
      className,
      access = "private",
    },
    ref
  ) => {
    const { uploadFile, isPending } = useUpload();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string>("image/jpeg");
    const [crop, setCrop] = useState<Crop>({
      unit: "%",
      x: 25,
      y: 25,
      width: 30 * (aspect ?? 1),
      height: 30,
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const fileInputKey = useRef<number>(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

    const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setFileType(file.type);
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          setSelectedImage(reader.result as string)
        );
        reader.readAsDataURL(file);
      } else {
        handleClose();
      }
    };

    const onLoad = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        imgRef.current = e.currentTarget;
      },
      []
    );

    const getCroppedImg = useCallback(
      (image: HTMLImageElement, crop: PixelCrop) => {
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
      },
      [fileType]
    );

    const handleClose = useCallback(() => {
      setSelectedImage(null);
      setCrop({
        unit: "%",
        x: 25,
        y: 25,
        width: 50,
        height: 50,
      });
      setCompletedCrop(null);
      fileInputKey.current += 1;
      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }
    }, []);

    const handleUpload = useCallback(async () => {
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

      const url = await uploadFile({ file, path, access });
      if (onFileUploaded) {
        onFileUploaded(`${url}`);
      }

      handleClose();
    }, [
      completedCrop,
      getCroppedImg,
      filename,
      fileType,
      uploadFile,
      path,
      access,
      onFileUploaded,
      handleClose,
    ]);

    const buttonOnClick = useCallback((newState: boolean) => {
      if (newState) {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }
    }, []);

    useEffect(() => {
      const currentFileInput = fileInputRef.current;

      currentFileInput?.addEventListener("cancel", handleClose);

      return () => {
        currentFileInput?.removeEventListener("cancel", handleClose);
      };
    }, [handleClose]);

    return (
      <div ref={ref} className={className}>
        <input
          key={fileInputKey.current}
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onSelectFile}
        />
        <Dialog onOpenChange={buttonOnClick}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div>
              {selectedImage && (
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  ruleOfThirds={ruleOfThirds}
                  circularCrop={circularCrop}
                  aspect={circularCrop ? 1 : aspect}
                >
                  <img
                    src={selectedImage}
                    onLoad={onLoad}
                    alt="Crop"
                    style={{ maxWidth: "100%" }}
                  />
                </ReactCrop>
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

ImageUploadModal.displayName = "ImageUploadModal";
