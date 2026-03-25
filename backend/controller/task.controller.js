import Task from "../models/task.model.js"
import { errorHandler } from "../utils/error.js"


export const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body

        if (!Array.isArray(assignedTo)) {
            return next(errorHandler(400, "assign to must be an array of users Ids"))
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
            createdBy:req.user.id,
        })

        res.status(201).json({ message: "task created sucessfulyy" })

    } catch (error) {
        next(error)
    }
}