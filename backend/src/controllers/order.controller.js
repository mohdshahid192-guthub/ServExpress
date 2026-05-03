import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {Order} from "../models/orders.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const orderPlace = asyncHandler(async (req, res) => {

  
  const professionalId = req.body?.professionalId
  const userId = req.user?._id
  
  if (!professionalId || !userId) {
    throw new ApiError(400, "either user is invalid or professiona id is wrong")
  }



  
     if (userId === professionalId) {
      throw new ApiError(400, "You can not send service request to Yourself")
     }
      const existingOrder = await Order.findOne({
    customer: userId,
    professional: professionalId,
    status: "requested"
  });

  if (existingOrder) {
    throw new ApiError(400, "Order already placed");
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
     
      
    
   
     
     return res.status(200).json(new ApiResponse(200, ordersuccessfull, "order placed successfully"))

})

const getOrderDetails = asyncHandler(async(req, res) => {

  const user = req.user

  if (!user) {
    throw new ApiError(401, "Unauthorized User")
  }

  const orders = await Order.aggregate([
  {
    $match: { customer: user._id }
  },
  {
    $lookup: {
      from: "users",
      localField: "professional",
      foreignField: "_id",
      as: "professionalDetails"
    }
  },
  {
   $project: {
    _id: 1,
    status: 1,
    createdAt: 1,
    "professionalDetails._id": 1,
    "professionalDetails.fullName": 1,
    "professionalDetails.serviceCharge": 1,
    "professionalDetails.avatar": 1,

   }
  },
  {
    $sort: { createdAt: -1 }
  }
]);

 console.log(orders);
 
  return res.status(200).json(new ApiResponse(200, orders, "orders fetched successfully"))



})


const getRequestDetails = asyncHandler(async (req, res) => {
      
  const professional = req.user

  if (!professional) {
    throw new ApiError(400, "User is not logged in")
  }

  const requests = await Order.aggregate([
    {$match: {professional: professional._id, status: "requested"}},
    {$lookup: {
      from: "users",
      localField: "customer",
      foreignField: "_id",
      as: "customerDetails"
    }},
    {$unwind: "$customerDetails"},
    {
      $project: {
         _id: 1,
    status: 1,
    createdAt: 1,
    "customerDetails._id": 1,
    "customerDetails.username": 1,

      }
    }
  ]);

  if (!requests) {
    return res.status(200).json(new ApiResponse(200, {}, "No requests to accept"))
  }
  
  return res.status(200).json(new ApiResponse(200, requests, "Requests fetched succesfully"))

})

const changeStatus = asyncHandler(async (req, res) => {
  const {orderId, status} = req.body
  
if (!orderId && !status) {
  throw new ApiError(400, "No request to accept");
  
}

  const order = await Order.findOne({$and: [{_id: orderId}, {status: "requested"}]})

  if (!order) {
    throw new ApiError(400, "No such order found");
    
  }

  order.status = status

  await order.save({validateBeforeSave: false})


  return res.status(200).json(new ApiResponse(200, order, "Order status changed"))

})


const showPendingSection = asyncHandler(async (req, res) => {
      
  const professional = req.user

  if (!professional) {
    throw new ApiError(400, "User is not logged in")
  }

  const pendings = await Order.aggregate([
    {$match: {professional: professional._id, status: "pending"}},
    {$lookup: {
      from: "users",
      localField: "customer",
      foreignField: "_id",
      as: "customerDetails"
    }},
    {$unwind: "$customerDetails"},
    {
      $project: {
         _id: 1,
    status: 1,
    createdAt: 1,
    "customerDetails._id": 1,
    "customerDetails.username": 1,
    "customerDetails.phone": 1

      }
    }
  ]);
  
  

  if (!pendings) {
    return res.status(200).json(new ApiResponse(200, {}, "No requests to accept"))
  }
  
  return res.status(200).json(new ApiResponse(200, pendings, "Requests fetched succesfully"))

})


export {
  orderPlace, getOrderDetails, getRequestDetails, changeStatus, showPendingSection
}

