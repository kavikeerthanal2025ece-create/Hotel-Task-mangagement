const INSPECTION_API = "/api/inspections";


// ===============================
// LOAD INSPECTIONS
// ===============================

async function loadInspections() {

    try {

        const response = await fetch(INSPECTION_API);

        if (!response.ok) {
            throw new Error("Could not load inspections");
        }

        const inspections = await response.json();

        const inspectionList =
            document.getElementById("inspectionList");

        let passed = 0;
        let failed = 0;

        inspectionList.innerHTML = "";


        // ===============================
        // EMPTY STATE
        // ===============================

        if (inspections.length === 0) {

            inspectionList.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 50px;
                    color: #9aa1a7;
                ">

                    <div style="font-size:45px;">
                        🔍
                    </div>

                    <h3 style="
                        margin-top:15px;
                        font-family:Georgia,serif;
                    ">
                        No inspections yet
                    </h3>

                    <p style="
                        margin-top:8px;
                        font-size:12px;
                    ">
                        Start by conducting a room inspection.
                    </p>

                </div>
            `;

            updateInspectionCounts(0, 0, 0);

            return;
        }


        // ===============================
        // CREATE CARDS
        // ===============================

        inspections.forEach(inspection => {

            if (inspection.result === "PASS") {
                passed++;
            }

            if (inspection.result === "FAIL") {
                failed++;
            }


            const isPass =
                inspection.result === "PASS";


            const icon =
                isPass ? "🟢" : "🔴";


            const resultClass =
                isPass
                    ? "inspection-pass"
                    : "inspection-fail";


            inspectionList.innerHTML += `

                <div class="inspection-card">

                    <div class="inspection-card-top">

                        <div>

                            <div class="inspection-title">
                                ${icon} Room Inspection
                            </div>

                            <div class="inspection-id">
                                Inspection #${inspection.id}
                            </div>

                        </div>


                        <span class="
                            inspection-result
                            ${resultClass}
                        ">
                            ${inspection.result}
                        </span>

                    </div>


                    <div class="inspection-details">


                        <div class="inspection-detail">

                            <span>
                                🛏️ Room
                            </span>

                            <strong>
                                Room #${inspection.roomId}
                            </strong>

                        </div>


                        <div class="inspection-detail">

                            <span>
                                👩‍💼 Housekeeper
                            </span>

                            <strong>
                                HK #${inspection.housekeeperId}
                            </strong>

                        </div>


                        <div class="inspection-detail">

                            <span>
                                📋 Result
                            </span>

                            <strong>
                                ${inspection.result}
                            </strong>

                        </div>


                        <div class="inspection-comment">

                            💬
                            ${inspection.comments
            || "No comments provided."}

                        </div>


                    </div>

                </div>

            `;

        });


        updateInspectionCounts(
            inspections.length,
            passed,
            failed
        );


    } catch (error) {

        console.error(
            "Inspection loading failed:",
            error
        );


        document.getElementById(
            "inspectionList"
        ).innerHTML = `

            <div style="
                grid-column:1 / -1;
                text-align:center;
                padding:40px;
                color:#b44e48;
            ">

                ❌ Unable to load inspection records.

                <br><br>

                <small>
                    Please make sure the Spring Boot server is running.
                </small>

            </div>

        `;

    }

}



// ===============================
// UPDATE COUNTERS
// ===============================

function updateInspectionCounts(
    total,
    passed,
    failed
) {

    document.getElementById(
        "totalInspections"
    ).textContent = total;


    document.getElementById(
        "passedInspections"
    ).textContent = passed;


    document.getElementById(
        "failedInspections"
    ).textContent = failed;

}



// ===============================
// SHOW / HIDE FORM
// ===============================

function showInspectionForm() {

    const form =
        document.getElementById("inspectionForm");


    if (form.style.display === "block") {

        form.style.display = "none";

    } else {

        form.style.display = "block";

        form.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}



// ===============================
// SUBMIT INSPECTION
// ===============================

async function submitInspection() {

    const roomId =
        document.getElementById(
            "inspectionRoomId"
        ).value;


    const housekeeperId =
        document.getElementById(
            "inspectionHousekeeperId"
        ).value;


    const result =
        document.getElementById(
            "inspectionResult"
        ).value;


    const comments =
        document.getElementById(
            "inspectionComments"
        ).value;


    // Validation

    if (!roomId || !housekeeperId) {

        alert(
            "Please enter Room ID and Housekeeper ID."
        );

        return;
    }


    const inspectionData = {

        roomId: Number(roomId),

        housekeeperId: Number(housekeeperId),

        result: result,

        comments: comments

    };


    try {

        const response = await fetch(
            INSPECTION_API,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(
                    inspectionData
                )
            }
        );


        if (!response.ok) {

            alert(
                "Inspection failed ❌\n\n" +
                "Please check the Room ID and " +
                "Housekeeper ID."
            );

            return;
        }


        alert(
            "Inspection recorded successfully! 🎉"
        );


        // Clear form

        document.getElementById(
            "inspectionRoomId"
        ).value = "";


        document.getElementById(
            "inspectionHousekeeperId"
        ).value = "";


        document.getElementById(
            "inspectionComments"
        ).value = "";


        document.getElementById(
            "inspectionResult"
        ).value = "PASS";


        // Hide form

        document.getElementById(
            "inspectionForm"
        ).style.display = "none";


        // Reload records

        loadInspections();


    } catch (error) {

        console.error(
            "Inspection submission failed:",
            error
        );


        alert(
            "Server connection failed ❌"
        );

    }

}



// ===============================
// INITIAL LOAD
// ===============================

loadInspections();