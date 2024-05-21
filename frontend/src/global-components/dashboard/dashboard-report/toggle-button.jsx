import React from "react";

export const ToggleButton = ({ onClick }) => {
  const buttonStyle = {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    borderTopLeftRadius: "25px",
    borderTopRightRadius: "25px",
    borderBottomRightRadius: "25px",
    borderBottomLeftRadius: "25px",
  };

  return (
    <button style={buttonStyle} onClick={onClick}>Generate</button>
  );
};