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
            createdBy: req.user.id,
        })

        res.status(201).json({ message: "task created sucessfulyy" })

    } catch (error) {
        next(error)
    }
}

export const getTasks = async (req, res, next) => {
    try {
        //find status
        const { status } = req.query

        let filter = {}
        if (status) {
            filter.status = status
        }
        let tasks

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImage"
            )
        } else {
            tasks = await Task.find({
                ...filter,
                assignedTo: req.user.id,
            }).populate("assignedTo", "name email profileImage")

        }
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length

                return { ...task._doc, completedCount: completedCount }
            })
        )

        //status summary count

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user.id }
        )
        const pendingTask = await Task.countDocuments({
            ...filter,
            status: "Pending",
            //if looged in user is not admin then add assigned to fileter
            //if looged in user is an admin then nothing to do ,just count
            ...(req.user.role != "admin" && { assignedTo: req.user.id })

        })
        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role != "admin" && { assignedTo: req.user.id })

        })
        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role != "admin" && { assignedTo: req.user.id })

        })

        res.status(200).json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTask,
                inProgressTasks,
                completedTasks
            },
        })

    } catch (error) {
        next(error)
    }
}