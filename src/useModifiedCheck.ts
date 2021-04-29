import { useCallback, useEffect, useState } from "react";

const CONFIRM_MESSAGE = "Any unsaved changes will be lost.  Are you sure?";

export const useModifiedCheck = () => {
  const [modified, setModified] = useState(false);
  const onUnload = useCallback(
    (event) => {
      if (modified) {
        if (event) {
          // NB: Chrome & Firefox ignore the message but display an equivalent generic message
          event.returnValue = CONFIRM_MESSAGE;
          event.preventDefault();
          return event;
        }
        return CONFIRM_MESSAGE;
      }
    },
    [modified]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [onUnload]);

  return setModified;
};
