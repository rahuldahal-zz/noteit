import React, { useEffect, useState } from "react";
import useFetch from "@hooks/useFetch";
import { Link } from "react-router-dom";

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

  function SearchResults() {
    if (data.length === 0) {
      return <h3>No results found!</h3>;
    }
    return (
      <div className="search__results">
        {data.map((unit) => {
          const { unit: number, title, subject, url, _id } = unit;
          return (
            <Link to={url} className="result" key={_id}>
              <h5 className="result__title">{title}</h5>
              <h6 className="result__subject">
                Unit {number} | {subject}
              </h6>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="search">
      <input
        className="search__field"
        type="text"
        name="searchTerm"
        placeholder="Type any keywords..."
        onChange={(e) => handleOnChange(e)}
      />
      {isLoading ? <h3>Loading...</h3> : <SearchResults />}
    </div>
  );
}
