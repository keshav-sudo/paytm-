const express = require("express");
const zod = require("zod");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Account, User } = require("../db");

const router = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signup", async (req, res) => {
    const parsedBody = signupBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(403).json({ msg: "Invalid credentials" });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).json({ message: "Already registered" });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    });

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        message: "Account created successfully",
        token
    });
});

router.post("/signin", async (req, res) => {
    const parsedBody = signinBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token });
});

module.exports = router;
 