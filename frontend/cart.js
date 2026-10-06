function loadCart() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartContainer = document.getElementById("cartContainer");

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("totalAmount").innerText = "Total: ₹0";
        return;
    }

    let total = 0;

    cart.forEach(function(item, index) {

        const itemTotal = item.price * item.quantity;

        total = total + itemTotal;

        const div = document.createElement("div");

        div.innerHTML = `
            <h3>${item.name}</h3>

            <p>Price: ₹${item.price}</p>

            <p>
                Quantity:
                <button onclick="decreaseQuantity(${index})">-</button>

                ${item.quantity}

                <button onclick="increaseQuantity(${index})">+</button>
            </p>

            <p>Item Total: ₹${itemTotal}</p>

            <button onclick="removeItem(${index})">
                Remove
            </button>

            <hr>
        `;

        cartContainer.appendChild(div);
    });

    document.getElementById("totalAmount").innerText =
        "Total: ₹" + total;
}


function increaseQuantity(index) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity++;

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


function decreaseQuantity(index) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


function removeItem(index) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


async function placeOrder() {

    const customerName =
        document.getElementById("customerName").value;

    const email =
        document.getElementById("email").value;

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (customerName === "" || email === "") {
        alert("Please enter your name and email.");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let total = 0;

    cart.forEach(function(item) {
        total += item.price * item.quantity;
    });

    try {

        const response = await fetch(
            "http://localhost:5000/api/orders",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    customerName: customerName,
                    email: email,
                    items: cart,
                    totalAmount: total
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Order placed successfully!");

            localStorage.removeItem("cart");

            loadCart();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log("Order error:", error);

        alert("Unable to place order.");

    }
}


loadCart();