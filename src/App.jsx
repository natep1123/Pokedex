import React, { useState, useEffect } from "react";
import Pokedex from "./components/Pokedex";
import "./App.css";

function App() {
  // State to store Pokémon data with images
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch Pokémon list and their images
  async function fetchPokemonData() {
    // Utility function to randomize Pokémon order
    //--> FISHER-YATES SHUFFLE ALGORITHM
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
    };

    // Try/Catch
    try {
      setLoading(true); //Set loading to true
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100"
      );
      const data = await response.json();

      // Fetch details for each Pokémon (including image)
      const pokemonObjects = await Promise.all(
        data.results.map(async (poke) => {
          const pokeResponse = await fetch(poke.url);
          const pokeData = await pokeResponse.json();

          //Destructure the data object and add to the pokemonObjects array
          return {
            name: pokeData.name,
            image: pokeData.sprites.front_default, // Get Pokémon sprite image
            id: pokeData.id, // Get Pokémon ID
          };
        }) //End of map
      ); //End of Promise.all

      shuffleArray(pokemonObjects); //Shuffle Pokémon order
      pokemonObjects.length = 10; // Limit Pokémon to 10
      setPokemon(pokemonObjects); //Set state with Pokémon data
    } catch (error) {
      alert("Error fetching Pokémon data. Please try again.");
      console.error("Error fetching Pokémon data:", error);
    } finally {
      setLoading(false); //Set loading to false
    }
  }

  // Refresh Pokémon data on button click
  const handleClick = () => {
    fetchPokemonData();
  };

  // Fetch Pokémon data on component mount
  useEffect(() => {
    fetchPokemonData();
  }, []);

  return (
    <main className="app">
      <h1>Pokedex</h1>
      <button onClick={handleClick}>Refresh</button>

      {loading && <h2>Loading...</h2>}

      {!loading && (
        <Pokedex pokemon={pokemon} fetchPokemonData={fetchPokemonData} />
      )}
    </main>
  );
}

export default App;
