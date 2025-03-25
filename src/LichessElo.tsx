import React, { useState, useEffect } from "react";

interface LichessEloProps {
  username: string;
}

const LichessElo = ({ username }: LichessEloProps) => {
  const [ratings, setRatings] = useState<
    { mode: string; rating: number; prog: number }[]
  >([]);

  useEffect(() => {
    fetch(`https://lichess.org/api/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.perfs) {
          console.log(data.perfs);
          const filteredRatings = Object.entries(data.perfs)
            .filter(([_, stats]: any) => !stats.prov) // Remove provisional ratings
            .map(([mode, stats]: any) => ({
              mode,
              rating: stats.rating,
              prog: stats.prog || 0
            }));
          setRatings(filteredRatings);
        }
      })
      .catch((err) => console.error("Failed to fetch Lichess data", err));
  }, [username]);

  const containerStyle = {
    backgroundColor: "#262522",
    color: "white",
    margin: "5px",
    padding: "10px",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "100%"
  };

  const listStyle = { listStyleType: "none", padding: 0 };
  const listItemStyle = { marginBottom: "5px" };

  return (
    <div style={containerStyle}>
      <h2>{username}'s Lichess Elo</h2>
      {ratings.length > 0 ? (
        <ul style={listStyle}>
          {ratings.map(({ mode, rating, prog }) => (
            <li key={mode} style={listItemStyle}>
              <strong>{mode}:</strong> {rating}{" "}
              <span style={{ color: prog >= 0 ? "green" : "red" }}>
                ({prog >= 0 ? "+" : ""}
                {prog})
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading or no data available...</p>
      )}
    </div>
  );
};

export default LichessElo;
