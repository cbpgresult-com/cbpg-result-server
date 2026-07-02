/*
====================================================
RESULT LOGIC
====================================================
*/

function getResultLink(row, year, examType, sem, rowIndex) {

    let link = "";

    // 2023-26 = Old Session
    // 2024-27 = New Session
    const isNewSession = rowIndex >= 376;

    examType = String(examType || "").toUpperCase();
    year = String(year || "");
    sem = parseInt(sem);

    /*
    ====================================================
    BACK PAPER
    ====================================================
    */

    if (examType === "BACKPAPER") {

        // 2025 Back Paper
        if (year === "2025") {

            link = row[`Back Sem${sem} Link`] || "";

        }

        // 2026 Back / Back In Back
        else if (year === "2026") {

            const back2 =
                row[`Back2 sem${sem}`] ||
                row[`Back2 Sem${sem}`] ||
                "";

            const back1 =
                row[`Back Sem${sem} Link`] ||
                "";

               console.log("Back1 =", back1);
console.log("Back2 =", back2);

            if (back2 !== "") {

                link = back2;

            } else {

                link = back1;

            }

        }

        return link.trim();

    }

    /*
    ====================================================
    NORMAL RESULT
    ====================================================
    */

    if (!isNewSession) {

        // Session 2023-26

        if (year === "2024" && (sem === 1 || sem === 2)) {

            link = row[`Sem${sem} Link`] || "";

        }

        else if (year === "2025" && (sem === 3 || sem === 4)) {

            link = row[`Sem${sem} Link`] || "";

        }

        else if (year === "2026" && (sem === 5 || sem === 6)) {

            link = row[`Sem${sem} Link`] || "";

        }

    }

    else {

        // Session 2024-27

        if (year === "2025" && (sem === 1 || sem === 2)) {

            link = row[`Sem${sem} Link`] || "";

        }

        else if (year === "2026" && (sem === 3 || sem === 4)) {

            link = row[`Sem${sem} Link`] || "";

        }

    }

    return String(link || "").trim();

}

/*
====================================================
EXPORT
====================================================
*/

module.exports = {

    getResultLink

};
