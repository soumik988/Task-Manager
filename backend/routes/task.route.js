import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser.js"
import { createTask, getTasks, getTasksById, updateTask } from "../controller/task.controller.js"


const router=express.Router()

router.post("/create",verifyToken,adminOnly,createTask)

router.get("/",verifyToken,getTasks)


router.get("/:id",verifyToken,getTasksById)


router.put("/:id",verifyToken,updateTask )





export default router