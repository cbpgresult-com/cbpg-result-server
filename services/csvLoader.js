const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let students = [];

/*
=========================================
LOAD CSV
=========================================
*/

function loadCSV(callback) {

    students = [];

    const csvPath = path.join(
        __dirname,
        "..",
        "data",
        "students.csv"
    );

    fs.createReadStream(csvPath)

        .pipe(csv())

        .on("data", (row) => {

           const roll = String(row["Roll No"] || "").trim();

// Sirf valid numeric roll wale records load karo
if (!/^\d+$/.test(roll)) {
    return;
}

students.push(row);
        })

        .on("end", () => {

            console.log("====================================");
            console.log("CSV Loaded Successfully");
            console.log("Total Records :", students.length);
            console.log("====================================");

            if (callback) callback();

        })

        .on("error", (err) => {

            console.log("CSV ERROR");
            console.log(err);

        });

}

/*
=========================================
GET ALL STUDENTS
=========================================
*/

function getStudents() {

    return students;

}

/*
=========================================
GET STUDENT BY INDEX
=========================================
*/

function getStudent(index) {

    return students[index];

}

/*
=========================================
TOTAL RECORDS
=========================================
*/

function totalStudents() {

    return students.length;

}

/*
=========================================
RELOAD CSV
=========================================
*/

function reloadCSV(callback) {

    console.log("Reloading CSV...");

    loadCSV(callback);

}

module.exports = {

    loadCSV,

    getStudents,

    getStudent,

    totalStudents,

    reloadCSV

};
