import React, { useEffect, useState } from "react";
import useFetch from "@hooks/useFetch";
import Results from "./Results";

export default function SearchNote() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [startFetching, status, data] = useFetch();

  function sendSearchQuery() {
    try {
      startFetching({
        url: "/users/notes/search",
        params: { searchTerm },
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleOnChange(e) {
    const { value } = e.currentTarget;
    if (value.length > 3 && value.trim() !== searchTerm) {
      setSearchTerm(value.trim());
      console.log({ value, searchTerm });
    }
  }

  useEffect(() => {
    if (searchTerm !== "") {
      sendSearchQuery();
    }
  }, [searchTerm]);

  useEffect(() => {
    if (data !== null) {
      setIsLoading(false);
    }
  }, [data]);

  return (
    <div className="search">
      <input
        className="search__field"
        type="text"
        name="searchTerm"
        placeholder="Type any keywords..."
        onChange={(e) => handleOnChange(e)}
      />
      {isLoading ? <h3>Loading...</h3> : <Results data={data} />}
    </div>
  );
}
