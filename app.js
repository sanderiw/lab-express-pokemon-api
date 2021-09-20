const express = require("express");
const { v4: uuidv4 } = require("uuid");

const PORT = 4000;

// Importing all the pokemon for our data file
const allPokemon = require("./data");

const app = express();
// Setting up server to understand json
app.use(express.json());

// Get all pokemons from database
app.get("/pokemon", (req, res) => {
    console.log("Listened GET in /pokemon");
    return res.status(200).json(allPokemon);
});

// Get pokemon detail by id
app.get("/pokemon/:id", (req, res) => {
    console.log(`Listened GET in /pokemon/${req.params.id}`);
    const foundPokemon = allPokemon.find((pokemon) => {
        return pokemon.id.toString() === req.params.id;
    });
    console.log(foundPokemon);
    if (foundPokemon) {
        return res.status(200).json(foundPokemon);
    }

    return res.status(400).json({ msg: "Pokemon not found" });
});

// Get pokemons searching by name or type
app.get("/search", (req, res) => {
    console.log(Object.keys(req.query));
    if (req.query.name) {
        const searchResult = allPokemon.filter((pokemonObj) => {
            return pokemonObj.name
                .toLowerCase()
                .includes(req.query.name.toLowerCase());
        });
        if (searchResult.length) {
            return res.status(200).json({ searchResult });
        }
    } else if (req.query.type) {
        const searchResult = allPokemon.filter((pokemonObj) => {
            for (let type of pokemonObj.types) {
                if (type.toLowerCase().includes(req.query.type.toLowerCase())) {
                    return true;
                }
            }
        });
        if (searchResult.length) {
            return res.status(200).json({ searchResult });
        }
    }
    return res.status(404).json({ msg: "Search not found" });
});

// Post to insert new Pokemon
app.post("/pokemon", (req, res) => {
    const data = { ...req.body, id: allPokemon[allPokemon.length - 1].id + 1 };
    allPokemon.push(data);

    res.status(201).json(data);
});

// Put to replace data
app.put("/pokemon/:id", (req, res) => {
    const foundPokemonId = allPokemon.findIndex((pokemonObj) => {
        return pokemonObj.id.toString() === req.params.id;
    });
    if (foundPokemonId > -1) {
        const updatedData = { ...allPokemon[foundPokemonId], ...req.body };
        allPokemon[foundPokemonId] = updatedData;
        return res.status(200).json(updatedData);
    }
    return res.status(404).json({ msg: "Pokemon not found" });
});

// Delete to delete a pokemon entry
app.delete("/pokemon/:id", (req, res) => {
    const foundPokemonId = allPokemon.findIndex((pokemonObj) => {
        return pokemonObj.id.toString() === req.params.id;
    });

    if (foundPokemonId > -1) {
        allPokemon.splice(foundPokemonId, 1);
        return res.status(200).json({});
    }

    return res.status(404).json({ msg: "Pokemon not found" });
});

// -- Define your route listeners here! --

app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`));
