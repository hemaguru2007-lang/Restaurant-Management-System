require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const User = require("./models/User");
const Menu = require("./models/Menu");
const Table = require("./models/Table");
const Reservation = require("./models/Reservation");
const Order = require("./models/Order");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// GMAIL / NODEMAILER
// ==========================================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
    res.send("Restaurant Management API is running");
});


// ==========================================
// REGISTER USER + WELCOME EMAIL
// ==========================================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        // Save user
        await newUser.save();


        // ======================================
        // WELCOME EMAIL
        // ======================================

        const mailOptions = {

            from: process.env.GMAIL_USER,

            to: email,

            subject: "Welcome to Our Restaurant!",

            text: `Hello ${name},

Welcome to our Restaurant Management System!

Your account has been successfully registered.

You can now login and reserve a table or order food.

Regards,
Restaurant Management Team`
        };

        await transporter.sendMail(mailOptions);


        // Response
        res.status(201).json({

            message: "Registration successful and welcome email sent!",

            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }

        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({

            message: "Registration failed",

            error: error.message

        });

    }

});


// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        res.status(200).json({

            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({

            message: "Login failed",

            error: error.message

        });

    }

});


// ==========================================
// GET ALL MENU ITEMS
// ==========================================

app.get("/api/menu", async (req, res) => {

    try {

        const menuItems = await Menu.find();

        res.status(200).json(menuItems);

    } catch (error) {

        res.status(500).json({

            message: "Unable to get menu",

            error: error.message

        });

    }

});


// ==========================================
// ADD MENU ITEM
// ==========================================

app.post("/api/menu", async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            category,
            image
        } = req.body;

        const menuItem = new Menu({

            name,
            description,
            price,
            category,
            image

        });

        await menuItem.save();

        res.status(201).json({

            message: "Menu item added successfully",

            menuItem: menuItem

        });

    } catch (error) {

        console.error("Menu error:", error);

        res.status(500).json({

            message: "Unable to add menu item",

            error: error.message

        });

    }

});


// ==========================================
// UPDATE MENU ITEM
// ==========================================

app.put("/api/menu/:id", async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            category,
            image
        } = req.body;

        const updatedMenu = await Menu.findByIdAndUpdate(

            req.params.id,

            {
                name,
                description,
                price,
                category,
                image
            },

            {
                new: true
            }

        );

        if (!updatedMenu) {

            return res.status(404).json({

                message: "Menu item not found"

            });

        }

        res.status(200).json({

            message: "Menu item updated successfully",

            menuItem: updatedMenu

        });

    } catch (error) {

        res.status(500).json({

            message: "Unable to update menu item",

            error: error.message

        });

    }

});


// ==========================================
// DELETE MENU ITEM
// ==========================================

app.delete("/api/menu/:id", async (req, res) => {

    try {

        const deletedMenu =
            await Menu.findByIdAndDelete(req.params.id);

        if (!deletedMenu) {

            return res.status(404).json({

                message: "Menu item not found"

            });

        }

        res.status(200).json({

            message: "Menu item deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: "Unable to delete menu item",

            error: error.message

        });

    }

});


// ==========================================
// ADD SAMPLE MENU
// ==========================================

app.post("/api/menu/sample", async (req, res) => {

    try {

        const sampleItems = [

            {
                name: "Pizza",
                description: "Cheese Pizza",
                price: 250,
                category: "Main Course"
            },

            {
                name: "Burger",
                description: "Chicken Burger",
                price: 180,
                category: "Fast Food"
            },

            {
                name: "Biryani",
                description: "Chicken Biryani",
                price: 220,
                category: "Main Course"
            },

            {
                name: "Pasta",
                description: "White Sauce Pasta",
                price: 200,
                category: "Main Course"
            },

            {
                name: "Fresh Lime Juice",
                description: "Fresh Lemon Juice",
                price: 80,
                category: "Drinks"
            }

        ];

        await Menu.insertMany(sampleItems);

        res.status(201).json({

            message: "Sample menu added successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: "Error adding sample menu",

            error: error.message

        });

    }

});


// ==========================================
// GET ALL TABLES
// ==========================================

app.get("/api/tables", async (req, res) => {

    try {

        const tables = await Table.find();

        res.status(200).json(tables);

    } catch (error) {

        res.status(500).json({

            message: "Unable to get tables",

            error: error.message

        });

    }

});


// ==========================================
// ADD SAMPLE TABLES
// ==========================================

app.post("/api/tables/sample", async (req, res) => {

    try {

        const tables = [

            {
                tableNumber: 1,
                capacity: 2
            },

            {
                tableNumber: 2,
                capacity: 2
            },

            {
                tableNumber: 3,
                capacity: 4
            },

            {
                tableNumber: 4,
                capacity: 4
            },

            {
                tableNumber: 5,
                capacity: 6
            },

            {
                tableNumber: 6,
                capacity: 8
            }

        ];

        await Table.insertMany(tables);

        res.status(201).json({

            message: "Sample tables added successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: "Error adding sample tables",

            error: error.message

        });

    }

});


// ==========================================
// CREATE RESERVATION + EMAIL
// ==========================================

app.post("/api/reservations", async (req, res) => {

    try {

        const {
            customerName,
            email,
            tableNumber,
            date,
            time,
            guests
        } = req.body;


        // Check required fields
        if (
            !customerName ||
            !email ||
            !tableNumber ||
            !date ||
            !time ||
            !guests
        ) {

            return res.status(400).json({

                message: "All reservation fields are required"

            });

        }


        // ======================================
        // CHECK TABLE
        // ======================================

        const table = await Table.findOne({

            tableNumber: tableNumber

        });


        if (!table) {

            return res.status(404).json({

                message: "Table not found"

            });

        }


        // ======================================
        // CHECK TABLE CAPACITY
        // ======================================

        if (guests > table.capacity) {

            return res.status(400).json({

                message:
                    "This table cannot accommodate this many guests"

            });

        }


        // ======================================
        // CHECK EXISTING RESERVATION
        // ======================================

        const existingReservation =
            await Reservation.findOne({

                tableNumber: tableNumber,

                date: date,

                time: time,

                status: {
                    $ne: "Cancelled"
                }

            });


        if (existingReservation) {

            return res.status(400).json({

                message:
                    "This table is already reserved for this time"

            });

        }


        // ======================================
        // CREATE RESERVATION
        // ======================================

        const reservation = new Reservation({

            customerName,
            email,
            tableNumber,
            date,
            time,
            guests

        });


        // Save reservation
        await reservation.save();


        // ======================================
        // RESERVATION CONFIRMATION EMAIL
        // ======================================

        const mailOptions = {

            from: process.env.GMAIL_USER,

            to: email,

            subject: "Table Reservation Confirmed",

            text: `Hello ${customerName},

Your table reservation has been confirmed!

Reservation Details:

Table Number: ${tableNumber}
Date: ${date}
Time: ${time}
Number of Guests: ${guests}

Thank you for choosing our restaurant.

We look forward to serving you!

Regards,
Restaurant Management Team`
        };


        // Send email
        await transporter.sendMail(mailOptions);


        // ======================================
        // RESPONSE
        // ======================================

        res.status(201).json({

            message:
                "Table reserved successfully and confirmation email sent!",

            reservation: reservation

        });


    } catch (error) {

        console.error("Reservation error:", error);

        res.status(500).json({

            message: "Reservation failed",

            error: error.message

        });

    }

});


// ==========================================
// CREATE FOOD ORDER
// ==========================================

app.post("/api/orders", async (req, res) => {

    try {

        const {
            customerName,
            email,
            items,
            totalAmount
        } = req.body;


        if (
            !customerName ||
            !email ||
            !items ||
            totalAmount === undefined
        ) {

            return res.status(400).json({

                message:
                    "Customer name, email, items and total amount are required"

            });

        }


        const order = new Order({

            customerName,
            email,
            items,
            totalAmount

        });


        await order.save();


        res.status(201).json({

            message: "Order placed successfully",

            order: order

        });


    } catch (error) {

        console.error("Order error:", error);

        res.status(500).json({

            message: "Order failed",

            error: error.message

        });

    }

});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});