const express = require("express");
const https = require("https");
const http = require("http");

const router = express.Router();

const loader = require("../services/csvLoader");
const { getResultLink } = require("../config/resultLogic");

/*
==========================================================
CHECK URL
==========================================================
*/

function checkUrl(url) {

    return new Promise((resolve) => {

        if (!url) return resolve(false);

        const client = url.startsWith("https") ? https : http;

        const req = client.request(url, { method: "HEAD" }, (res) => {

            resolve(res.statusCode === 200);

        });

        req.on("error", () => resolve(false));

        req.end();

    });

}

/*
==========================================================
SEARCH RESULT
==========================================================
*/

router.get("/search", async (req, res) => {

    console.log(req.query);

    const roll = String(req.query.roll || "").trim();
    const father = String(req.query.father || "").toLowerCase().trim();
    const course = String(req.query.course || "").toUpperCase().trim();
    const sem = parseInt(req.query.sem || "0");
    const examType = String(req.query.examType || "").toUpperCase().trim();
    const year = String(req.query.year || "").trim();

    const students = loader.getStudents();
    console.log("Total Students :", students.length);

    for (let i = 0; i < students.length; i++) {

        const row = students[i];

const sheetRoll = String(row["Roll No"] || "").trim();

// Pehle Roll match karo
if (sheetRoll !== roll) {
    continue;
}

const sheetFather = String(row["Father Name"] || "")
    .toLowerCase()
    .trim();

const sheetMother = String(row["Mother Name"] || "")
    .toLowerCase()
    .trim();

const sheetCourse = String(row["Course"] || "")
    .toUpperCase()
    .trim();

const inputName = father.toLowerCase().trim();

const fatherMatch =
    sheetFather === inputName ||
    sheetFather.startsWith(inputName + " ");

const motherMatch =
    sheetMother === inputName ||
    sheetMother.startsWith(inputName + " ");

console.log("Input :", inputName);
console.log("Father :", sheetFather);
console.log("Mother :", sheetMother);
console.log("FatherMatch :", fatherMatch);
console.log("MotherMatch :", motherMatch);

        if (
           
            sheetCourse === course &&
            (fatherMatch || motherMatch)
        ) {

            const link = getResultLink(
                row,
                year,
                examType,
                sem,
                i
            );

            console.log("==============");
            console.log("Roll :", roll);
            console.log("Exam :", examType);
            console.log("Year :", year);
            console.log("Sem :", sem);
            console.log("Link :", link);
            console.log("==============");

            // Link hi nahi mila
            if (!link) {

                return res.json({
                    status: "notfound"
                });

            }

            // Link valid hai ya nahi
            const valid = await checkUrl(link);

            if (!valid) {

                return res.json({
                    status: "notuploaded"
                });

            }

            // Success
            return res.json({

                status: "found",

                student: row["Student Name"],

                semester: sem,

                link: link

            });

        }

    }

    // Student hi nahi mila

    return res.json({

        status: "notfound"

    });

});

/*
==========================================================
DOWNLOAD PDF
==========================================================
*/

router.get("/download", (req, res) => {

    const pdfUrl = req.query.url;
const fileName =
req.query.filename || "Result.pdf";

    if (!pdfUrl) {
        return res.status(400).send("Missing URL");
    }

    const client = pdfUrl.startsWith("https") ? https : http;

    client.get(pdfUrl, (response) => {

        // Agar original server ne 404 diya
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).send("PDF Not Found");
        }

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

       res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName}"`
);
        response.pipe(res);

    }).on("error", (err) => {

        console.log(err);

        res.status(500).send("Download Failed");

    });

});
/*
==========================================================
EXPORT
==========================================================
*/

module.exports = router;
