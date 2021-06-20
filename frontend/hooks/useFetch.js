import { useAuth } from "@contexts/AuthProvider";
import React, { useEffect, useState } from "react";

export default function useFetch() {
  const [fetchArgs, startFetching] = useState(null);
  const [renewedAccessToken, setRenewedAccessToken] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [data, setData] = useState(null);
  const { accessToken, refreshToken } = useAuth();

  async function fetchWrapper() {
    let { url, params, options = {} } = fetchArgs;
    options = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${renewedAccessToken || accessToken}`,
      },
    };

    const formattedParams = new URLSearchParams({
      ...params,
      refreshToken,
    }).toString();

    try {
      setFetchStatus("fetching");
      const res = await fetch(`${url}/?${formattedParams}`, options);
      setFetchStatus(res.status);
      const clonedResponse = res.clone();
      if (res.status === 401) {
        const { accessToken: newToken } = await res.json();
        setRenewedAccessToken(newToken);
      }
      if (
        res.headers.get("content-type") === "application/json; charset=utf-8"
      ) {
        const parsedData = await clonedResponse.json();
        return setData(parsedData);
      }
    } catch (err) {
      console.log(err);
      return setFetchStatus("failed");
    }
  }

  useEffect(() => fetchArgs && fetchWrapper(), [fetchArgs, renewedAccessToken]);

  return [startFetching, fetchStatus, data];
}
