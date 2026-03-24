import express from "express"
import { adminOnly, verifyToken } from "../utils/verifuUser.js";
import { getUsers, getUsersById } from "../controller/user.controller.js";

const router =express.Router()

//User management

router.get("/get-users",verifyToken,adminOnly,getUsers)


router.get("/:id",verifyToken,getUsersById)

export default router;