import { graphql } from "gql.tada";
import { GetMeQuery } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { OWNER_PERMISSIONS, PERMISSIONS } from "@/utils/permissions";
import { client } from "@/lib/apollo-client";
import { jotaiStore } from "@/lib/jotai-store";
import { Mode, useMode } from "./use-mode";

export const selectedMembershipIdAtom = atomWithStorage<string | undefined>(
  "selectedMembership",
  undefined
);

export const getMe = async () => {
  const { data } = await client.query<GetMeQuery>({
    query: useMe.query,
  });

  const selectedMembershipId = jotaiStore.get(selectedMembershipIdAtom);

  if (!selectedMembershipId) {
    jotaiStore.set(selectedMembershipIdAtom, data?.me?.orgMemberships[0]?.id);
  }

  return {
    me: data?.me,
    selectedMembership: data?.me?.orgMemberships.find(
      (orgMembership) => orgMembership.id === selectedMembershipId
    ),
  };
};

export const useMe = () => {
  const { mode, setMode } = useMode();

  const { data, loading, error, client, refetch } = useQuery<GetMeQuery>(
    useMe.query
  );

  const [selectedMembershipId, setSelectedMembershipId] = useAtom(
    selectedMembershipIdAtom
  );

  // Select the first membership if none is selected
  useEffect(() => {
    if (!loading && !data?.me?.orgMemberships.length && mode != Mode.Guest) {
      setMode(Mode.Guest);
      return;
    }

    if (
      mode === Mode.Org &&
      !!data?.me?.orgMemberships.length &&
      (!selectedMembershipId ||
        !data.me.orgMemberships.find(
          (orgMembership) => orgMembership.id === selectedMembershipId
        ))
    ) {
      setSelectedMembershipId(data.me.orgMemberships[0].id);
    }

    if (!loading && mode === Mode.Guest) {
      setSelectedMembershipId(undefined);
    }
  }, [
    data,
    loading,
    mode,
    selectedMembershipId,
    setMode,
    setSelectedMembershipId,
  ]);

  const selectedMembership = useMemo(
    () =>
      data?.me?.orgMemberships?.find(
        (orgMembership) => orgMembership.id === selectedMembershipId
      ),
    [data, selectedMembershipId]
  );

  const memberships = useMemo(() => data?.me?.orgMemberships, [data]);

  // If the selected membership is the owner, use the owner permissions
  const permissions: PERMISSIONS = useMemo(
    () =>
      selectedMembership?.organization.owner_id === data?.me?.id
        ? OWNER_PERMISSIONS
        : (selectedMembership?.role?.permissions as PERMISSIONS),
    [
      data?.me?.id,
      selectedMembership?.organization.owner_id,
      selectedMembership?.role?.permissions,
    ]
  );

  return {
    selectedMembership,
    memberships,
    permissions,
    setSelectedMembershipId,
    me: data?.me,
    isLoading: loading,
    error,
    client,
    refetch,
  };
};

useMe.query = graphql(/* GraphQL */ `
  query GetMe {
    me {
      id
      email
      first_name
      last_name
      avatar_url
      created_at
      orgMemberships {
        id
        role {
          id
          name
          permissions
        }
        organization {
          id
          name
          owner_id
          website
          logo_url
          address
          city
          state
          country_code
          postal_code
          timezone
          lat
          lng
        }
      }
    }
  }
`);
