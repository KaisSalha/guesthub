// import { useRouter } from "@tanstack/react-router";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

export enum Mode {
  Org = "org",
  Guest = "guest",
}

const modeAtom = atomWithStorage<Mode>("mode", Mode.Org, undefined, {
  getOnInit: true,
});

export const useMode = () => {
  const [mode, setMode] = useAtom(modeAtom);

  return {
    mode,
    setMode,
  };
};
