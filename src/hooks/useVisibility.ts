import { useCallback, useState } from "react";

type VisibilityKey = "ADD" | "EDIT" | "DELETE";

export const useVisibility = () => {
  const [visibility, setVisibility] = useState<Record<VisibilityKey, boolean>>({
    ADD: false,
    EDIT: false,
    DELETE: false,
  });

  const openVisibility = useCallback((name: VisibilityKey) => {
    setVisibility((prev) => ({ ...prev, [name]: true }));
  }, []);

  const closeVisibility = useCallback((name: VisibilityKey) => {
    setVisibility((prev) => ({ ...prev, [name]: false }));
  }, []);

  return {
    visibility,
    openVisibility,
    closeVisibility,
  };
};
