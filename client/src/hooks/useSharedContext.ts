import { useContext } from "react";
import { SharedContext } from "../components/contexts/sharedContext";

export function useSharedContext() {
  return useContext(SharedContext)
}