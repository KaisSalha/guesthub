import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface Invite {
  inviteId: string | null;
  timestamp: number | null;
}

export const inviteIdAtom = atomWithStorage<Invite>("inviteId", {
  inviteId: null,
  timestamp: null,
});

export const useStoredInvite = () => {
  const [invite, setInvite] = useAtom(inviteIdAtom);

  // If 10 minutes have passed, set inviteId to null
  if (invite.timestamp && Date.now() - invite.timestamp > 10 * 60 * 1000) {
    setInvite({ inviteId: null, timestamp: null });
  }

  return { inviteId: invite.inviteId };
};
