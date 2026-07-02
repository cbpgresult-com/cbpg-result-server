const express = require("express");
const cors = require("cors");
const path = require("path");

const loader = require("./services/csvLoader");
const resultRoute = require("./routes/resultRoute");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Public Website
app.use(express.static(path.join(__dirname, "public")));

// Result APIs
app.use("/", resultRoute);

// Start Server after CSV Load
loader.loadCSV(() => {

    const PORT = 3000;

    app.listen(PORT, () => {

        console.log("====================================");
        console.log(" CBPG RESULT SERVER STARTED ");
        console.log("====================================");
        console.log("Server : http://localhost:" + PORT);
        console.log("Records :", loader.totalStudents());
        console.log("====================================");

    });

});