import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser.js"
import { createTask, deleteTask, getTasks, getTasksById, updateTask, updateTaskStatus } from "../controller/task.controller.js"


const router=express.Router()

router.post("/create",verifyToken,adminOnly,createTask)

router.get("/",verifyToken,getTasks)


router.get("/:id",verifyToken,getTasksById)


router.put("/:id",verifyToken,updateTask )

router.delete("/:id",verifyToken,adminOnly,deleteTask)

router.put("/:id/status",verifyToken,updateTaskStatus )





export default router