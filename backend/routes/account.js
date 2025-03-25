const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        // Use `findOneAndUpdate` instead of `updateOne`
        await Account.findOneAndUpdate({ userId: req.userId }, { $inc: { balance: -amount } }, { session });
        await Account.findOneAndUpdate({ userId: to }, { $inc: { balance: amount } }, { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Transfer failed" });
    }
});

module.exports = router;
