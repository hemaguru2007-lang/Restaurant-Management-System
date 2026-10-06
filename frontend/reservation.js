const tableSelect =
    document.getElementById("tableNumber");


// Load tables

async function loadTables() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/tables"
            );


        const tables =
            await response.json();


        tableSelect.innerHTML =
            '<option value="">Select Table</option>';


        tables.forEach(function(table) {

            const option =
                document.createElement("option");


            option.value =
                table.tableNumber;


            option.textContent =
                "Table " +
                table.tableNumber +
                " - " +
                table.capacity +
                " seats";


            tableSelect.appendChild(option);

        });


    } catch (error) {

        console.log(
            "Error loading tables:",
            error
        );

    }

}


loadTables();


// Reservation

const reservationForm =
    document.getElementById(
        "reservationForm"
    );


reservationForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const customerName =
            document.getElementById(
                "customerName"
            ).value;


        const email =
            document.getElementById(
                "email"
            ).value;


        const date =
            document.getElementById(
                "date"
            ).value;


        const time =
            document.getElementById(
                "time"
            ).value;


        const guests =
            document.getElementById(
                "guests"
            ).value;


        const tableNumber =
            document.getElementById(
                "tableNumber"
            ).value;


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/reservations",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            customerName:
                                customerName,

                            email:
                                email,

                            tableNumber:
                                Number(tableNumber),

                            date:
                                date,

                            time:
                                time,

                            guests:
                                Number(guests)

                        })

                    }
                );


            const data =
                await response.json();


            const message =
                document.getElementById(
                    "reservationMessage"
                );


            if (response.ok) {

                message.innerText =
                    "Table reserved successfully!";

                message.style.color =
                    "green";


                reservationForm.reset();

            } else {

                message.innerText =
                    data.message;

                message.style.color =
                    "red";

            }


        } catch (error) {

            console.log(error);

            document.getElementById(
                "reservationMessage"
            ).innerText =
                "Unable to connect to server.";

        }

    }
);