import { graphql } from "gql.tada";
import { GetMeQuery } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

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

  const selectedMembership = data?.me?.memberships?.find(
    (membership) => membership.id === selectedMembershipId
  );

  return {
    selectedMembership,
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
