import { useAuth } from "@contexts/AuthProvider";
import React, { useEffect, useState } from "react";

export default function useFetch(url, options) {
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [data, setData] = useState(null);
  const { refreshToken } = useAuth();

  async function fetchData(renewedAccessToken) {
    if (renewedAccessToken) {
      options.headers.Authorization = `Bearer ${renewedAccessToken}`;
    }
    try {
      setFetchStatus("fetching");
      const res = await fetch(`${url}/?refreshToken=${refreshToken}`, options);
      setFetchStatus(res.status);
      if (res.status === 203) {
        const { accessToken } = await res.json();
        return fetchData(accessToken);
      }
      const parsedData = await res.json();
      return setData(parsedData);
    } catch (err) {
      console.log(err);
      return setFetchStatus("failed");
    }
  }
  useEffect(() => fetchData(), [url]);

  return [fetchStatus, data];
}
