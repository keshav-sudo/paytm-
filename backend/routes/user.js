const express = require("express");
const zod = require("zod");
const mongoose = require("mongoose");
const jwt  = require ("jsonwebtoken")
const {JWT_SECRET} = require("../config");
const {Account , User} = require("../db");
const router = express.router();


const signupbody = zod.object({
    username : zod.string().email(),
    password : zod.string(),
    firstname : zod.string(),
    lastname : zod.string()

});
const signinbody = zod.object 