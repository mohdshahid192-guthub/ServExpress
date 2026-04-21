import mongoose, {Schema} from "mongoose"

const orderSchema = new Schema({

     customer: {
      type: Schema.Types.ObjectId,
      ref: "User", //user with  accountType customer
      required: true
    },
    professoinal: {
      type: Schema.Types.ObjectId,
      ref: "User", //user with  accountType professional
      required: true
    },

    status: {
      Type: String, 
      required: true,
      enum: ["requested", "pending", "served", "missed"]

    }


}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema)