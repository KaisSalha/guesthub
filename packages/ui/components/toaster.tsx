import { MEDIA_QUERIES } from "../lib";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { useMediaQuery } from "usehooks-ts";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const isDesktop = useMediaQuery(MEDIA_QUERIES.MD);

  return (
    <Sonner
      position={isDesktop ? "bottom-right" : "top-center"}
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background dark:bg-background-surface group-[.toaster]:text-foreground border group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-foreground-subtle",
          actionButton:
            "group-[.toast]:bg-background-inverted group-[.toast]:text-foreground-inverted",
          cancelButton:
            "group-[.toast]:bg-background-muted group-[.toast]:text-foreground-subtle",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
