const {mongoose,Schema,model} = require( 'mongoose')
const { string, number } = require ('zod') 
mongoose.connect("mongodb+srv://sharma09keshav:KxiBTMZZCcFfgxiY@cluster0.hvsu9dc.mongodb.net/paytm").then(()=>{
    console.log("connected succesfully !");
});

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type : String,
        required: true,
        minLength: 8,
        maxLength: 10

    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }




});

const accountSchema = new mongoose.Schema({
    userid : { 
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true 
    },

    accountamount : {
        type : Number,
        required : true

    }

});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
module.exports = { User, Account };
