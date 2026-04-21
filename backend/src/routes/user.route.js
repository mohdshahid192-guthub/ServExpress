import { Router } from "express";
import { logOutUser, refreshAccessToken, registerUser, userLogin, userLoginCheck } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";


const router = Router()



router.route("/register").post(registerUser)

router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/check-user-login").get(userLoginCheck)

export default router
