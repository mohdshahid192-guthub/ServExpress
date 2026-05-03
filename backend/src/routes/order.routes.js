import { Router } from "express";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";
import { changeStatus, getOrderDetails, getRequestDetails, orderPlace, showPendingSection } from "../controllers/order.controller.js";

const router = Router()

router.route("/order-placed").post(verifyJWT, orderPlace)
router.route("/order-datails").get(verifyJWT, getOrderDetails)
router.route("/requests").get(verifyJWT, getRequestDetails)
router.route("/changeStatus").post(changeStatus)
router.route("/pending").get(verifyJWT, showPendingSection)




export default router