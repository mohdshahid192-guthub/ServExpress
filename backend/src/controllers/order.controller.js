import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {Order} from "../models/orders.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateOrderTokenAndSave = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
   
   const orderToken = await order.generateOrderToken()
   
    
     order.orderToken = await orderToken
    await order.save({ validateBeforeSave: false })
    return { orderToken }
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating token")
  }
}

const orderPlace = asyncHandler(async (req, res) => {

 if (req.cookies?.orderToken) {
  throw new ApiError(400, "order already Placed")
 }

     const professionalId = req.body?.professionalId
     const userId = req.user?._id
     
     if (!professionalId || !userId) {
      throw new ApiError(400, "either user is invalid or professiona id is wrong")
     }
     if (userId === professionalId) {
      throw new ApiError(400, "You can not send service request to Yourself")
     }
     const order = await Order.create({
      customer: userId,
      professional: professionalId,
      status: "requested"
     })

     const ordersuccessfull = await Order.findOne({
      customer: userId,
      professional: professionalId,
      status: "requested"
     })
      console.log(ordersuccessfull._id);
      
    const orderToken = await generateOrderTokenAndSave(ordersuccessfull?._id)
   
     const options ={
      httpOnly: true,
      secure: true
     }
     return res.status(200).cookie("orderToken", orderToken, options).json(new ApiResponse(200, order, "order placed successfully"))

})

export {orderPlace}

