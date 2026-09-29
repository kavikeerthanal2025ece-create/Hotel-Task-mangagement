const GUEST_API = "/api/guests";


/* =========================
   LOAD GUESTS
========================= */

async function loadGuests() {

    try {

        const response =
            await fetch(GUEST_API);

        if (!response.ok) {
            throw new Error("Could not load guests");
        }

        const guests =
            await response.json();

        const guestList =
            document.getElementById("guestList");


        guestList.innerHTML = "";


        /* =========================
           GUEST CARDS
        ========================= */

        guests.forEach(guest => {

            guestList.innerHTML += `

                <div class="guest-card">

                    <div class="guest-card-top">

                        <div class="guest-avatar">
                            👤
                        </div>


                        <div>

                            <div class="guest-name">
                                ${guest.name}
                            </div>

                            <div class="guest-id">
                                Guest ID: #${guest.id}
                            </div>

                        </div>

                    </div>


                    <div class="guest-details">

                        <div class="guest-detail">

                            <span>
                                📞 Phone
                            </span>

                            <strong>
                                ${guest.phone}
                            </strong>

                        </div>


                        <div class="guest-detail">

                            <span>
                                ✉️ Email
                            </span>

                            <strong>
                                ${guest.email}
                            </strong>

                        </div>


                        <div class="guest-detail">

                            <span>
                                🏨 Allocation
                            </span>

                            <strong>
                                Active
                            </strong>

                        </div>


                        <div class="room-badge">

                            🛏️ Room ${guest.roomId}

                        </div>

                    </div>


                    <div class="guest-actions">

                        <button
                            class="delete-guest-btn"
                            onclick="
                                deleteGuest(${guest.id})
                            "
                        >
                            🗑 Delete Guest
                        </button>

                    </div>

                </div>

            `;

        });


        /* =========================
           EMPTY STATE
        ========================= */

        if (guests.length === 0) {

            guestList.innerHTML = `

                <div
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:50px 20px;
                    "
                >

                    <div style="font-size:45px;">
                        👤
                    </div>

                    <h3
                        style="
                            margin-top:15px;
                            font-family:Georgia,serif;
                        "
                    >
                        No Guests Registered
                    </h3>

                    <p
                        style="
                            margin-top:8px;
                            color:#89929a;
                            font-size:12px;
                        "
                    >
                        Add a guest and allocate a ready room.
                    </p>

                </div>

            `;

        }


        /* =========================
           UPDATE COUNTERS
        ========================= */

        document.getElementById(
            "totalGuests"
        ).textContent = guests.length;


        document.getElementById(
            "allocatedGuests"
        ).textContent =
            guests.filter(
                guest => guest.roomId != null
            ).length;


    }

    catch (error) {

        console.error(error);

        document.getElementById(
            "guestList"
        ).innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px;
                "
            >

                <h3>
                    ❌ Unable to load guests
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

function showGuestForm() {

    const form =
        document.getElementById("guestForm");


    if (form.style.display === "block") {

        form.style.display = "none";

    }

    else {

        form.style.display = "block";

    }

}


/* =========================
   ADD GUEST + ALLOCATE ROOM
========================= */

async function addGuest() {

    const name =
        document.getElementById(
            "guestName"
        ).value.trim();


    const phone =
        document.getElementById(
            "guestPhone"
        ).value.trim();


    const email =
        document.getElementById(
            "guestEmail"
        ).value.trim();


    const roomId =
        document.getElementById(
            "guestRoomId"
        ).value;


    if (!name || !phone || !email || !roomId) {

        alert(
            "Please fill all guest details."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${GUEST_API}/allocate`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        phone: phone,

                        email: email,

                        roomId: Number(roomId)

                    })

                }
            );


        if (!response.ok) {

            alert(
                "Room allocation failed ❌\n\n" +
                "Please make sure the selected room " +
                "is READY."
            );

            return;

        }


        alert(
            "Guest allocated successfully! 🎉"
        );


        /* CLEAR FORM */

        document.getElementById(
            "guestName"
        ).value = "";


        document.getElementById(
            "guestPhone"
        ).value = "";


        document.getElementById(
            "guestEmail"
        ).value = "";


        document.getElementById(
            "guestRoomId"
        ).value = "";


        document.getElementById(
            "guestForm"
        ).style.display = "none";


        loadGuests();

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection failed ❌"
        );

    }

}


/* =========================
   DELETE GUEST
========================= */

async function deleteGuest(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this guest?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${GUEST_API}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            alert(
                "Could not delete guest ❌"
            );

            return;

        }


        alert(
            "Guest deleted successfully."
        );


        loadGuests();

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

loadGuests();