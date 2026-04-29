import { Router } from "express";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";
import { orderPlace } from "../controllers/order.controller.js";

const router = Router()

router.route("/order-placed").post(verifyJWT, orderPlace)


export default router