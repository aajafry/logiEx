import { useCallback, useState } from "react";

export const useVisibility = () => {
  const [visibility, setVisibility] = useState({
    ADD: false,
    EDIT: false,
    DELETE: false,
  });

  const openVisibility = useCallback((name) => {
    setVisibility((prev) => ({ ...prev, [name]: true }));
  }, []);

  const closeVisibility = useCallback((name) => {
    setVisibility((prev) => ({ ...prev, [name]: false }));
  }, []);

  return {
    visibility,
    openVisibility,
    closeVisibility,
  };
};
