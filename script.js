// ===============================
// DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        const response = await fetch(
            "/api/dashboard/summary"
        );

        if (!response.ok) {
            throw new Error("Dashboard data not available");
        }

        const data = await response.json();


        // ===============================
        // MAIN STAT CARDS
        // ===============================

        setText("totalRooms", data.totalRooms);

        setText("readyRooms", data.readyRooms);

        setText("cleaningRooms", data.cleaningRooms);

        setText("dirtyRooms", data.dirtyRooms);

        setText("totalHousekeepers", data.totalHousekeepers);

        setText("totalTasks", data.totalCleaningTasks);


        // ===============================
        // ROOM STATUS VIEW
        // ===============================

        setText(
            "readyRoomsView",
            data.readyRooms
        );

        setText(
            "cleaningRoomsView",
            data.cleaningRooms
        );

        setText(
            "dirtyRoomsView",
            data.dirtyRooms
        );

        setText(
            "inspectedRoomsView",
            data.inspectedRooms
        );


    } catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );

    }

}


// ===============================
// SAFE TEXT UPDATE
// ===============================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value ?? 0;
    }

}


// ===============================
// LOAD DASHBOARD
// ===============================

loadDashboard();