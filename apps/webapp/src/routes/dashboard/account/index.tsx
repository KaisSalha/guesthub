import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { useHeader } from "@/components/header";

const Profile = () => {
  const [_, setHeader] = useHeader();

  useEffect(() => {
    setHeader({
      title: "Account",
      subtitle: "",
    });

    return () => {
      setHeader({
        title: "",
        subtitle: "",
      });
    };
  }, [setHeader]);

  return <div className="flex flex-col gap-8 mb-4"></div>;
};

export const Route = createFileRoute("/dashboard/account/")({
  component: Profile,
});
