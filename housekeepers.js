const HOUSEKEEPER_API = "/api/housekeeper";


async function loadHousekeepers() {

    try {

        const response = await fetch(HOUSEKEEPER_API);

        if (!response.ok) {
            throw new Error("Could not load housekeepers");
        }

        const housekeepers = await response.json();

        const list =
            document.getElementById("housekeeperList");


        let available = 0;
        let busy = 0;


        list.innerHTML = "";


        housekeepers.forEach(person => {

            // Count availability

            if (person.available) {
                available++;
            } else {
                busy++;
            }


            const status =
                person.available
                    ? "AVAILABLE"
                    : "BUSY";


            const statusClass =
                person.available
                    ? "staff-available"
                    : "staff-busy";


            const statusIcon =
                person.available
                    ? "🟢"
                    : "🔴";


            // Staff card

            list.innerHTML += `

                <div class="staff-card">

                    <div class="staff-top">

                        <div class="staff-avatar">
                            👩‍💼
                        </div>

                        <div>

                            <div class="staff-name">
                                ${person.name}
                            </div>

                            <div class="staff-id">
                                Employee ID:
                                ${person.employeeId}
                            </div>

                        </div>

                    </div>


                    <div class="staff-details">

                        <div class="staff-detail">

                            <span>
                                📞 Phone
                            </span>

                            <strong>
                                ${person.phone}
                            </strong>

                        </div>


                        <div class="staff-detail">

                            <span>
                                🆔 Staff ID
                            </span>

                            <strong>
                                HK-${person.id}
                            </strong>

                        </div>


                        <span
                            class="staff-status ${statusClass}"
                        >
                            ${statusIcon}
                            ${status}
                        </span>

                    </div>


                    <div class="staff-actions">

                        <button
                            class="delete-staff-btn"
                            onclick="deleteHousekeeper(${person.id})"
                        >
                            🗑 Delete
                        </button>

                    </div>

                </div>

            `;

        });


        // Empty state

        if (housekeepers.length === 0) {

            list.innerHTML = `

                <div
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:50px 20px;
                    "
                >

                    <div style="font-size:45px;">
                        👩‍💼
                    </div>

                    <h3
                        style="
                            margin-top:15px;
                            font-family:Georgia,serif;
                        "
                    >
                        No Housekeepers Yet
                    </h3>

                    <p
                        style="
                            margin-top:8px;
                            color:#89929a;
                            font-size:12px;
                        "
                    >
                        Add your first housekeeping staff member.
                    </p>

                </div>

            `;

        }


        // Update counters

        document.getElementById(
            "totalHousekeepers"
        ).textContent = housekeepers.length;


        document.getElementById(
            "availableCount"
        ).textContent = available;


        document.getElementById(
            "busyCount"
        ).textContent = busy;


    }

    catch (error) {

        console.error(error);

        document.getElementById(
            "housekeeperList"
        ).innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px;
                "
            >

                <h3>
                    ❌ Unable to load housekeepers
                </h3>

                <p
                    style="
                        margin-top:8px;
                        color:#89929a;
                    "
                >
                    Please check whether the server is running.
                </p>

            </div>

        `;

    }

}


/* =========================
   SHOW / HIDE FORM
========================= */

function showHousekeeperForm() {

    const form =
        document.getElementById(
            "housekeeperForm"
        );


    if (form.style.display === "block") {

        form.style.display = "none";

    }

    else {

        form.style.display = "block";

    }

}


/* =========================
   ADD HOUSEKEEPER
========================= */

async function addHousekeeper() {

    const name =
        document.getElementById(
            "hkName"
        ).value.trim();


    const employeeId =
        document.getElementById(
            "hkEmployeeId"
        ).value.trim();


    const phone =
        document.getElementById(
            "hkPhone"
        ).value.trim();


    const available =
        document.getElementById(
            "hkAvailable"
        ).value === "true";


    if (!name || !employeeId || !phone) {

        alert(
            "Please fill in all fields."
        );

        return;

    }


    try {

        const response = await fetch(
            HOUSEKEEPER_API,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    employeeId: employeeId,

                    phone: phone,

                    available: available

                })

            }
        );


        if (!response.ok) {

            alert(
                "Could not save housekeeper ❌"
            );

            return;

        }


        alert(
            "Housekeeper added successfully! 🎉"
        );


        // Clear fields

        document.getElementById(
            "hkName"
        ).value = "";


        document.getElementById(
            "hkEmployeeId"
        ).value = "";


        document.getElementById(
            "hkPhone"
        ).value = "";


        document.getElementById(
            "hkAvailable"
        ).value = "true";


        // Hide form

        document.getElementById(
            "housekeeperForm"
        ).style.display = "none";


        // Reload list

        loadHousekeepers();

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection failed ❌"
        );

    }

}


/* =========================
   DELETE HOUSEKEEPER
========================= */

async function deleteHousekeeper(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this housekeeper?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(

            `${HOUSEKEEPER_API}/${id}`,

            {
                method: "DELETE"
            }

        );


        if (!response.ok) {

            alert(
                "Could not delete housekeeper ❌"
            );

            return;

        }


        alert(
            "Housekeeper deleted successfully."
        );


        loadHousekeepers();

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection failed ❌"
        );

    }

}


/* =========================
   INITIAL LOAD
========================= */

loadHousekeepers();