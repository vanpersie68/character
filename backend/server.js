const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv"); 
const {readdirSync} = require("fs");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

//routes
readdirSync("./routes").map((result) => {
    app.use("/", require("./routes/" + result));
});

console.log(process.env.DATABASE_URL);
//database
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log(`Failed to connect mongoDB, because ${err}`));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening server is ${PORT}`);
});