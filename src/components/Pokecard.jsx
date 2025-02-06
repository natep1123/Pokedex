import React from "react";

const Pokecard = ({ name, image }) => {
  return (
    <div className="pokecard">
      <h3>{name}</h3>
      <img src={image} />
    </div>
  );
};

export default Pokecard;
