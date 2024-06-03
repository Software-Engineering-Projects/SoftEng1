import { Loader2, LoaderIcon } from "lucide-react";

export const MiniLoader = ({ message }) => {
  return (
    <>
      <Loader2 className="inline-flex me-1 w-4 h-4 animate-spin" aria-hidden="true" />
      {message}
    </>
  );
};

export default MiniLoader;