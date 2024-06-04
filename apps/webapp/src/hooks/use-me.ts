import { graphql } from "gql.tada";
import { GetMeQuery } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { OWNER_PERMISSIONS, PERMISSIONS } from "@/utils/permissions";

const selectedMembershipIdAtom = atomWithStorage<string | undefined>(
  "selectedMembership",
  undefined
);

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
      !!data?.me?.memberships.length &&
      (!selectedMembershipId ||
        !data.me.memberships.find(
          (membership) => membership.id === selectedMembershipId
        ))
    ) {
      setSelectedMembershipId(data.me.memberships[0].id);
    }
  }, [data, selectedMembershipId, setSelectedMembershipId]);

  const selectedMembership = useMemo(
    () =>
      data?.me?.memberships?.find(
        (membership) => membership.id === selectedMembershipId
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
      memberships {
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
