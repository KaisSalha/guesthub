import { useCallback, useEffect } from "react";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "../-components/layout";
import { Button } from "@guesthub/ui/button";
import { useMutation, useQuery } from "@apollo/client";
import { Avatar, AvatarFallback, AvatarImage } from "@guesthub/ui/avatar";
import { Building2 } from "lucide-react";
import {
  AcceptEventAttendanceMutation,
  GetEventAttendanceQuery,
  GetMeDocument,
  GetEventAttendanceQueryVariables,
} from "@/gql/graphql";
import { Card } from "@guesthub/ui/card";
import { GetEventAttendance } from "../-queries";
import { graphql } from "gql.tada";
import { toast } from "sonner";
import { useMe } from "@/hooks/use-me";

const Accept = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { refetch } = useMe();
  const navigate = useNavigate();
  const { attendanceId } = Route.useSearch();
  const { data, loading: isLoadingInvite } = useQuery<
    GetEventAttendanceQuery,
    GetEventAttendanceQueryVariables
  >(GetEventAttendance, {
    variables: { id: attendanceId },
    skip: !attendanceId || isLoading,
  });
  const [acceptInvitation, { loading: isLoadingAccept }] =
    useMutation<AcceptEventAttendanceMutation>(Accept.mutation, {
      update(cache) {
        cache.evict({ fieldName: "me" });
        cache.gc();
      },
      refetchQueries: [GetMeDocument],
    });

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate({ to: "/login" });
      return;
    }

    if (
      !isLoading &&
      !isLoadingInvite &&
      isAuthenticated &&
      !data?.eventAttendance
    ) {
      navigate({ to: "/dashboard" });
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    data?.eventAttendance,
    attendanceId,
    isLoadingInvite,
  ]);

  const onAccept = useCallback(async () => {
    const { errors } = await acceptInvitation({
      variables: {
        input: {
          attendanceId,
        },
      },
    });

    if (errors) {
      errors.forEach((error) => {
        toast.error(error.message);
      });
      return;
    }

    await refetch();

    navigate({ to: "/dashboard" });
  }, [acceptInvitation, attendanceId, navigate, refetch]);

  if (isLoading || isLoadingInvite) return null;

  if (!attendanceId || !data?.eventAttendance) return null;

  return (
    <Layout>
      <Card className="md:w-fit md:p-20" variant="desktopOnly">
        <div className="flex flex-col items-center gap-6 md:gap-10">
          <Avatar className="cursor-pointer w-fit h-fit rounded-md">
            <AvatarImage
              src={data.eventAttendance.event.logo_url ?? undefined}
              className="h-24 w-24 md:h-28 md:w-28"
            />
            <AvatarFallback className="bg-transparent border p-2 rounded-md">
              <Building2
                strokeWidth={0.5}
                className="h-24 w-24 md:h-28 md:w-28"
              />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl md:text-3xl font-bold">
            Join {data.eventAttendance.event.name} on GuestHub
          </h1>
          <Button loading={isLoadingAccept} onClick={onAccept} size="lg">
            Accept
          </Button>
          <p className="max-w-80 text-center">
            GuestHub helps your team manage their special guests more
            efficiently.
          </p>
        </div>
      </Card>
    </Layout>
  );
};

Accept.mutation = graphql(`
  mutation AcceptEventAttendance($input: AcceptEventAttendanceInput!) {
    acceptEventAttendance(input: $input) {
      success
    }
  }
`);

const searchSchema = z.object({
  attendanceId: z.string().catch(""),
});

export const Route = createFileRoute("/event-invite/accept/")({
  component: Accept,
  validateSearch: searchSchema,
});
