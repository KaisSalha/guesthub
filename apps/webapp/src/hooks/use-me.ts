import { graphql } from "gql.tada";
import { GetMeQuery } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { OWNER_PERMISSIONS, PERMISSIONS } from "@/utils/permissions";
import { client } from "@/lib/apollo-client";
import { jotaiStore } from "@/lib/jotai-store";

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
  const { data, loading, error, client, refetch } = useQuery<GetMeQuery>(
    useMe.query
  );

  const [selectedMembershipId, setSelectedMembershipId] = useAtom(
    selectedMembershipIdAtom
  );

  // Select the first membership if none is selected
  useEffect(() => {
    if (
      !!data?.me?.orgMemberships.length &&
      (!selectedMembershipId ||
        !data.me.orgMemberships.find(
          (orgMembership) => orgMembership.id === selectedMembershipId
        ))
    ) {
      setSelectedMembershipId(data.me.orgMemberships[0].id);
    }
  }, [data, selectedMembershipId, setSelectedMembershipId]);

  const selectedMembership = useMemo(
    () =>
      data?.me?.orgMemberships?.find(
        (orgMembership) => orgMembership.id === selectedMembershipId
      ),
    [data, selectedMembershipId]
  );

  // If the selected membership is the owner, use the owner permissions
  const permissions: PERMISSIONS = useMemo(
    () =>
      selectedMembership?.organization.owner_id === data?.me?.id
        ? OWNER_PERMISSIONS
        : selectedMembership?.role?.permissions,
    [
      data?.me?.id,
      selectedMembership?.organization.owner_id,
      selectedMembership?.role?.permissions,
    ]
  );

  return {
    selectedMembership,
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
      type
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
