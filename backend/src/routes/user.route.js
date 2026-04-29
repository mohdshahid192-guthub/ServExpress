import { Router } from "express";
import { logOutUser, professionalCardShowDown, professionalForBooking, professionalWithCategory, refreshAccessToken, registerUser, userLogin, userLoginCheck } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";


const router = Router()



router.route("/register").post(registerUser)

router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/check-user-login").get(userLoginCheck)
router.route("/render-professional").get(professionalCardShowDown)
router.route("/booking-datails").post(professionalForBooking)
router.route("/services-section").post(professionalWithCategory)

export default router
