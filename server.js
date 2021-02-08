require("dotenv").config();
var server = require("express");
var bodyParser = require("body-parser");
var { doTransaction } = require("./transactions");

const PORT = process.env.PORT || 8080;

var app = server();
app.use(bodyParser.json());


/* routes */
app.use("/transact/", doTransaction);

app.use("/", (req, res) => { res.send("Ping Success") });


/* start server */
app.listen(PORT, () => {
    console.log("Server running on Port:", PORT)
});

