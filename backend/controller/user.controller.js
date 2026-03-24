import Task from "../models/task.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"


export const getUsers = async (req, res, next) => {
    try {

        //all users role are find out
        const users = await User.find({ role: "user" }).select("-password")
        //calculation of task count
        const userWithTaskCount = await Promise.all(
            users.map(async (user) => {
                const pendingTask = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending",
                })
                const inProgressTask = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress",
                })
                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed",
                })


                return {
                    ...user._doc,
                    pendingTask,
                    inProgressTask,
                    completedTasks
                }
            })
        )

        res.status(200).json(userWithTaskCount)
    } catch (error) {
        next(error)
    }
}

export const getUsersById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password")

        if (!user) {
            return next(errorHandler(404, "User not found"))
        }

        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}