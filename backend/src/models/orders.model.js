import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"

const orderSchema = new Schema({

     customer: {
      type: Schema.Types.ObjectId,
      ref: "User", //user with  accountType customer
      required: true
    },
    professional: {
      type: Schema.Types.ObjectId,
      ref: "User", //user with  accountType professional
      required: true
    },

    status: {
      type: String, 
      required: true,
      enum: ["requested", "pending", "served", "missed"],
      default: "requested"
    },
    orderToken: {
      type: String
    }


}, {timestamps: true});

orderSchema.methods.generateOrderToken = function (){
return jwt.sign(
  {
    _id: this._id,
    customer: this.customer,
    professional: this.professional, 
    status: this.status
  },
  process.env.ORDER_TOKEN_SECRET,
  {expiresIn: process.env.ORDER_TOKEN_EXPIRY}
)

}

export const Order = mongoose.model("Order", orderSchema)