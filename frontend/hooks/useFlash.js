import { useEffect, useState } from "react";

export default function useFlash() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    console.log(message);
  }, [message]);

  return [message, setMessage];
}
