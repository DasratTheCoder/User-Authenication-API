import { Router } from "express";
import { loginUser, LogOutUser, registerUser } from "../controllers/user.controller.js";

const router = Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(LogOutUser)
export{
    router
}