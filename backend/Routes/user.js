// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");


const signupbody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success, data } = signupbody.safeParse(req.body);
    if (!success) {
        return res.status(403).json({
            msg: "Invalid input"
        });
    }

    const userexisting = await User.findOne({
        username: data.username
    });

    if (userexisting) {
        return res.status(411).json({
            msg: "Email already exists"
        });
    }

    const user = await User.create({
        username: data.username,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        msg: "Account created successfully",
        token: token
    });
});


const signinbody = zod.object({
    username : zod.string().email(),
    password : zod.string()
})


router.post("/signin" , async (req, res) =>{
    const { success, data } = signinbody.safeParse(req.body);
    if (!success) {
        return res.status(403).json({
            msg: "Invalid inputs"
        });
    }

    const user = await User.findOne({
        username: data.username,
        password: data.password
    });

    if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        return res.json({
            token: token
        });
    }

    res.status(411).json({
        msg: "Login problem"
    });
});

const updatebody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
});

router.put("/", authMiddleware, async (req, res) => {
    const { success, data } = updatebody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "Invalid input"
        });
    }

    await User.updateOne({ _id: req.userId }, data);

    res.json({
        msg: "Updated"
    });
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [
            { firstname: { "$regex": filter, "$options": "i" } },
            { lastname: { "$regex": filter, "$options": "i" } }
        ]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
});

module.exports = router;