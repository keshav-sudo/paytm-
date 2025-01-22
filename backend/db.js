const mongoose = require("mongoose");

(async () => {
    try {
        await mongoose.connect("mongodb+srv://sharma09keshav:KxiBTMZZCcFfgxiY@cluster0.hvsu9dc.mongodb.net/paytm");
        console.log("Connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
})();

//create schema for user 
const userschema = new mongoose.Schema ({
    username : {
        require : true,
        type : String,
        unique : true,
        maxLength : 50,
        minLength : 5
    } ,

    password : {
        require : true,
        type :  String,
        maxLength : 12,
        minLength : 8
    },
    firstname : {
        required :  true , 
        type :  String,
        trim : true
    },
    lastname : {
        
         required :  true , 
         type :  String,
         trim : true
       
    }
});

const accountSchema = new mongoose.Schema ({
    userId : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    
    }, 
    amount : {
        type : Number,
        required :  true,

    }
});

const User = mongoose.model ('User' ,userschema );
const Account = mongoose.model ('Account' , accountSchema);

module.exports = {
	User,
    Account
};
