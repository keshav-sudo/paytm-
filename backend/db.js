const mongoose = require("mongoose");

const db = async () => {
    try {
        await mongoose.connect("mongodb+srv://thesharmakeshav:hxVHFIha7mP82lj9@cluster0.kegg0.mongodb.net/paytm", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error while connecting to database", error);
    }
};

db();

// Define User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        maxlength: 20,//Fixed spelling (maxLength → maxlength)
        minlength: 5,  // Fixed spelling (minLength → minlength)
        lowercase: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
       
        minlength: 6, // Fixed spelling (minLengh → minlength)
        required: true
    },
    firstname: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    }
});

// Create User Model
const User = mongoose.model("User", userSchema);

// Define Account Schema
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Fixed ref (User → "User")
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

// Create Account Model
const Account = mongoose.model("Account", accountSchema);

// Correct Export Syntax
module.exports = { User, Account };
