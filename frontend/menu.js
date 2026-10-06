async function loadMenu() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/menu"
        );


        const menuItems =
            await response.json();


        const menuContainer =
            document.getElementById(
                "menuContainer"
            );


        menuContainer.innerHTML = "";


        menuItems.forEach(function(item) {

            const card =
                document.createElement("div");


            card.className = "menu-card";


            card.innerHTML = `

                <h3>${item.name}</h3>

                <p>${item.description}</p>

                <h4>₹${item.price}</h4>

                <p>
                    Category: ${item.category}
                </p>

                <button
                    onclick="addToCart(
                        '${item.name}',
                        ${item.price}
                    )">

                    Add to Cart

                </button>

            `;


            menuContainer.appendChild(card);

        });


    } catch (error) {

        console.log(
            "Error loading menu:",
            error
        );

    }

}


function addToCart(name, price) {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    cart.push({

        name: name,

        price: price,

        quantity: 1

    });


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(name + " added to cart!");

}


loadMenu();