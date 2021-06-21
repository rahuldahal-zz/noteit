import React from "react";
import { Link } from "react-router-dom";

export default function Results({ data }) {
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
