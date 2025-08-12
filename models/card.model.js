import mongoose from "mongoose";

const cardSchema = mongoose.Schema({
    name : { type : String },
    card_number : { type : Number, required : true },
    cvc : { type : Number },
    issuer : { type : String, enum : ["AMEX", "MASTERCARD"] }
})