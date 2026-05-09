import { Router } from "express";
import { getProfileDetails, logOutUser, professionalCardShowDown, professionalForBooking, professionalWithCategory, refreshAccessToken, registerUser, updateUserProfile, uploadAvatar, userLogin, userLoginCheck } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";


const router = Router()



router.route("/register").post(registerUser)

router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/check-user-login").get(userLoginCheck)
router.route("/render-professional").post(professionalCardShowDown)
router.route("/booking-datails").post(professionalForBooking)
router.route("/services-section").post(professionalWithCategory)
router.route("/profile-details").get(verifyJWT, getProfileDetails)
router.route("/updateAvatar").post(
  verifyJWT,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  uploadAvatar
);
router.route("/edit-profile").post(verifyJWT,updateUserProfile)




export default router
