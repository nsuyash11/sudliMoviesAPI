var express = require("express");
var route = express.Router();

var joi = require("joi"); //for request body json schema validation

/********************SAMPLE DATA OBJECT********************/

let moviesCatalogObject = {
    moviesList: [
      {
        id: 101,
        name: "Sairat",
        language: "Marathi",
        genre: "Love",
        rating: 4.6
      },
      {
        id: 102,
        name: "Madagascar",
        language: "English",
        genre: "Kids",
        rating: 4.3
      },
      {
        id: 10,
        name: "Zapaatalela",
        language: "Marathi",
        genre: "Horror",
        rating: 3.7
      },
      {
        id: 104,
        name: "Hungama",
        language: "Hindi",
        genre: "Comedy",
        rating: 3.4
      },
      {
        id: 105,
        name: "Darna Mana Hain",
        language: "Hindi",
        genre: "Horror",
        rating: 2.8
      },
      {
        id: 106,
        name: "Gangaajal",
        language: "Hindi",
        genre: "Social",
        rating: 3.9
      }
    ]
  };



/********************ALL ROUTES********************/

let movies = {};


route.get("/", (req, res) => {
  movies.moviesCatalog = moviesCatalogObject.moviesList;

  res.send(movies);
});

route.get("/genres", (req, res) => {
  let genres = [];
  let genresRaw = [];

  genresRaw = moviesCatalogObject.moviesList.map(movie => {
    return movie.genre;
  });

  genresRaw.map(genre => {
    !(genres.includes(genre)) ? genres.push(genre) : null; 
  });
  
  genres = genres.filter(genre => genre !== null);

  movies["genres"] = genres;

  res.send(movies);
});

route.get("/:id", (req, res) => {
  let keyId = parseInt(req.params.id);

  let result = moviesCatalogObject.moviesList.find(movie => movie.id === keyId);

  if(!result){
    return res.status(404).send("No movie found with id - " + keyId);
  }
  res.send(result);
});


route.post("/", (req, res) => {

  const validationResult = validate(req.body, "add");
  const { error } = validationResult;

  if(error){
    sDebug(error.details[0].message);
    return res.status(400).send(`Bad Request Body - Posted JSON not in desired format
    ${error.details[0].message}`);
  }

  let movie = {};
  
  movie = {...req.body};
  movie["id"] = 101 + moviesCatalogObject.moviesList.length;

  sDebug(movie);

  moviesCatalogObject.moviesList.push(movie);

  res.send(moviesCatalogObject);

});


route.put("/:id", (req, res) => {
  //find if movie with that id exists

  let keyId = parseInt(req.params.id);
  const movie = moviesCatalogObject.moviesList.find(m => m.id === keyId);

  if(!movie){
    return res.status(404).send("Movie not found with id - " + keyId);
  }

  //validate the schema of JSON of req body
  const validationResult = joi.validate(req.body);
  const { error } = validationResult;

  if(error){
    sDebug(error);
    return res.status(400).send(`Bad Request Body - Posted JSON not in desired format
    ${error}`);
  }

  //update that movie ref
  const { name, language, genre, rating } = req.body;

  movie.name = name;
  movie.language = language;
  movie.genre = genre;
  movie.rating = rating;

  res.send(`Movie Updated Successfully...
  ${movie}`);
});


route.delete("/:id", (req, res) => {
  let keyId = parseInt(req.params.id);
  const movie = moviesCatalogObject.moviesList.find(m => m.id === keyId);

  if(!movie){
    return res.status(404).send("Movie not found with id - " + keyId);
  }

  let keyIndex = moviesCatalogObject.moviesList.indexOf(movie);

  let delMovie = moviesCatalogObject.moviesList.splice(keyIndex, 1);

  res.send(`Movie deleted successfully - ${delMovie}`);
});



/********************UTILITY FUNCTIONS********************/

function validate(reqBody){
    let schema;
    // if (mode === "add"){
      schema = {
        name: joi.string()
        .min(3)
        .required(),
    
        language: joi.string()
        .min(5)
        .required(),
    
        genre: joi.string()
        .min(4)
        .required,
    
        rating : joi.number()
        .min(0)
        .max(5)
        .required()
      };
    // }
    // else if(mode === "edit"){
    //   schema = {
    //     name: joi.string()
    //     .min(3)
    //     .required(),
    
    //     language: joi.string()
    //     .min(5)
    //     .required(),
    
    //     genre: joi.string()
    //     .min(4)
    //     .required(),
    
    //     rating : joi.number()
    //     .min(0)
    //     .max(5)
    //     .required()
    //   };
    //}
    
    sDebug(schema);
    sDebug(reqBody);
  
    return joi.validate(reqBody, schema);
  }

/********************EXPORT ROUTES********************/

module.exports = route;