const ROOM_API = "/rooms";


async function loadRooms() {

    try {

        const response = await fetch(ROOM_API);

        if (!response.ok) {
            throw new Error("Could not load rooms");
        }

        const rooms = await response.json();

        const roomList =
            document.getElementById("roomList");


        let ready = 0;
        let cleaning = 0;
        let dirty = 0;
        let inspected = 0;


        roomList.innerHTML = "";


        rooms.forEach(room => {

            // Count room status

            if (room.status === "READY") {
                ready++;
            }

            if (room.status === "CLEANING") {
                cleaning++;
            }

            if (room.status === "DIRTY") {
                dirty++;
            }

            if (room.status === "INSPECTED") {
                inspected++;
            }


            // Status details

            let icon = "⚪";
            let statusClass = "room-status";

            if (room.status === "READY") {

                icon = "🟢";
                statusClass += " status-ready";

            }

            else if (room.status === "CLEANING") {

                icon = "🧹";
                statusClass += " status-cleaning";

            }

            else if (room.status === "DIRTY") {

                icon = "🔴";
                statusClass += " status-dirty";

            }

            else if (room.status === "INSPECTED") {

                icon = "🟡";
                statusClass += " status-inspected";

            }


            // Room card

            roomList.innerHTML += `

                <div class="room-card">

                    <div class="room-card-top">

                        <div>

                            <div class="room-number">
                                Room ${room.roomNumber}
                            </div>

                            <div class="room-type">
                                ${room.roomType}
                            </div>

                        </div>


                        <div class="room-icon">
                            🛏️
                        </div>

                    </div>


                    <div class="${statusClass}">

                        ${icon}
                        ${room.status}

                    </div>


                    <div class="room-actions">

                        <span
                            style="
                                font-size:10px;
                                color:#9aa1a7;
                            "
                        >
                            Room ID: ${room.id}
                        </span>


                        <button
                            class="change-btn"
                            onclick="changeRoomStatus(
                                ${room.id},
                                '${room.status}'
                            )"
                        >
                            Change Status →
                        </button>

                    </div>

                </div>

            `;

        });


        // Empty state

        if (rooms.length === 0) {

            roomList.innerHTML = `

                <div
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:50px 20px;
                    "
                >

                    <div style="font-size:45px;">
                        🏨
                    </div>

                    <h3 style="
                        margin-top:15px;
                        font-family:Georgia,serif;
                    ">
                        No Rooms Added
                    </h3>

                    <p style="
                        margin-top:8px;
                        color:#89929a;
                        font-size:12px;
                    ">
                        Add your first hotel room to begin.
                    </p>

                </div>

            `;

        }


        // Update counters

        document.getElementById("totalRooms").textContent =
            rooms.length;

        document.getElementById("readyCount").textContent =
            ready;

        document.getElementById("cleaningCount").textContent =
            cleaning;

        document.getElementById("dirtyCount").textContent =
            dirty;

        document.getElementById("inspectedCount").textContent =
            inspected;


    }

    catch (error) {

        console.error(error);

        document.getElementById("roomList").innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px;
                "
            >

                <h3>❌ Unable to load rooms</h3>

                <p style="
                    margin-top:8px;
                    color:#89929a;
                ">
                    Please check whether the server is running.
                </p>

            </div>

        `;

    }

}


/* =========================
   ADD ROOM FORM
========================= */

function showAddRoomForm() {

    const form =
        document.getElementById("addRoomForm");


    if (form.style.display === "block") {

        form.style.display = "none";

    }

    else {

        form.style.display = "block";

    }

}


/* =========================
   ADD ROOM
========================= */

async function addRoom() {

    const roomNumber =
        document.getElementById("roomNumber").value.trim();

    const roomType =
        document.getElementById("roomType").value.trim();

    const status =
        document.getElementById("roomStatus").value;


    if (!roomNumber || !roomType) {

        alert(
            "Please enter room number and room type."
        );

        return;

    }


    try {

        const response = await fetch(
            ROOM_API,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    roomNumber: roomNumber,

                    roomType: roomType,

                    status: status

                })

            }
        );


        if (!response.ok) {

            alert(
                "Room could not be added ❌"
            );

            return;

        }


        alert(
            "Room added successfully! 🎉"
        );


        // Clear form

        document.getElementById(
            "roomNumber"
        ).value = "";

        document.getElementById(
            "roomType"
        ).value = "";

        document.getElementById(
            "roomStatus"
        ).value = "DIRTY";


        document.getElementById(
            "addRoomForm"
        ).style.display = "none";


        // Reload rooms

        loadRooms();

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection failed ❌"
        );

    }

}


/* =========================
   CHANGE ROOM STATUS
========================= */

async function changeRoomStatus(
    id,
    currentStatus
) {

    let nextStatus = "";


    if (currentStatus === "DIRTY") {

        nextStatus = "CLEANING";

    }

    else if (currentStatus === "CLEANING") {

        nextStatus = "INSPECTED";

    }

    else if (currentStatus === "INSPECTED") {

        nextStatus = "READY";

    }

    else if (currentStatus === "READY") {

        alert(
            "This room is already READY 🟢"
        );

        return;

    }


    try {

        const response = await fetch(

            `/rooms/${id}/status?status=${nextStatus}`,

            {
                method: "PUT"
            }

        );


        if (!response.ok) {

            alert(
                "Status update failed ❌"
            );

            return;

        }


        loadRooms();

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

loadRooms();