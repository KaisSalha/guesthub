import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background-popover group-[.toaster]:text-foreground border group-[.toaster]:border-border-subtle group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-text-subtle",
          actionButton:
            "group-[.toast]:bg-background-inverted group-[.toast]:text-text-inverted",
          cancelButton:
            "group-[.toast]:bg-background-muted group-[.toast]:text-text-subtle",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
