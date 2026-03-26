import express from "express"
import { exportTaskReport, exportUsersReport } from "../controller/report.controller.js";
import { adminOnly, verifyToken } from "../utils/verifyUser.js";


const router = express.Router()

router.get("/export/tasks", verifyToken, adminOnly, exportTaskReport)

router.get("/export/users", verifyToken, adminOnly, exportUsersReport)

export default router;

