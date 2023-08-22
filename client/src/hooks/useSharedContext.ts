import { useContext } from "react";
import { SharedContext } from "../contexts/sharedContext";

export function useSharedContext() {
  return useContext(SharedContext)
}