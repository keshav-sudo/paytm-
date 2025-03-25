const express = require("express");
const zod = require("zod");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Added bcrypt for password security
const { JWT_SECRET } = require("../config");
const { Account, User } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6), //Enforce a minimum password length
    firstname: zod.string(),
    lastname: zod.string()
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

// 🚀 SIGNUP ROUTE
router.post("/signup", async (req, res) => {
    const parsedBody = signupBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(403).json({ msg: "Invalid credentials" });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).json({ message: "Already registered" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10); // ✅ Secure password hashing

    const user = await User.create({
        username: req.body.username,
        password: hashedPassword, // ✅ Store hashed password
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    });

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" }); // ✅ Added JWT expiration

    res.json({
        message: "Account created successfully",
        token
    });
});

// 🚀 SIGNIN ROUTE
router.post("/signin", async (req, res) => {
    const parsedBody = signinBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = await User.findOne({ username: req.body.username });
    
    if (!user) {
        return res.status(411).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password); // compare hashed password
    if (!isPasswordValid) {
        return res.status(411).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ token });
});

// 🚀 UPDATE ROUTE
const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
});

router.put("/update", authMiddleware, async (req, res) => { // Fixed missing "/" in the route
    const { success } = updateBody.safeParse(req.body);
    
    if (!success) {
        return res.status(411).json({ message: "Error while updating" });
    }

    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10); //  Hash new password before saving
    }

    await User.updateOne(
        { _id: req.userId },
        { $set: req.body }
    );

    res.json({ message: "Updated successfully" });
});

// 🚀 BULK SEARCH ROUTE
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstname: { "$regex": filter, "$options": "i" } }, // Fixed inconsistent naming
            { lastname: { "$regex": filter, "$options": "i" } }
        ]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstname: user.firstname, //  Fixed field name
            lastname: user.lastname,
            _id: user._id
        }))
    });
});

module.exports = router;
