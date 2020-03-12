/********************DEPENDENCY IMPORTS********************/

var express =  require("express"); //req-res handling framework of js
var morgan = require("morgan"); //to log http request parameters
var config = require("config"); //to get preset params from resp files from config folder as per NODE_ENV env variable and those files' names(imp)
var sDebug = require("debug")("startup"); //startup is DEBUG env variable
var dDebug = require("debug")("db"); //db is DEBUG env variable
var joi = require("joi"); //for request body json schema validation

var moviesRoute = require("../routes/api-movies.js"); //import all routes

var app = express();  


/********************MIDDLEWARES********************/

// app.use(some middleware); to add a middleware between req - mw1 - mw2 - ... - res
app.use(express.json());
// parse req body from json to object
app.use(express.urlencoded({ extended: true }));
// decode req params from url like ...com?key1=val1?key2=val2
app.use("/static", express.static("../public"));
// fetch static files reqd on /static route from ../public folder

app.use("/api/movies", moviesRoute);


/********************APP CONFIGURATIONS********************/

app.set("view engine", "pug");
app.set("views","./views"); // select views from ./views folder

if (process.env.NODE_ENV === "development"){
    app.use(morgan("tiny"));  // log http request headers in default tiny format
}



/********************SOME ROUTES********************/  

app.get("/", (req, res) => {
    res.render("pages/index", {title: "Sudli App", message: "Welcome to SUDLI CINEMAS API..."});
});


/********************SPINNING SERVER PORT********************/

const port = process.env.PORT || 3000;
app.listen(port, () => {
    sDebug(`From config file : ${config.get("environment")}.json
    App Name : ${config.get("name")}
    Environment : ${config.get("environment")}
    Mail Server : ${config.get("mail.host")}`);
    sDebug("App started on port - " + port); 
});


