import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "pending",
    },
    status: {
        type: String,
        enum: ["Pendding", "In Progress", "Completed"],
        default: "Pending"
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    attachments: [
        {
            type: String,
        }
    ],
    todoCheckList:[todoSchema],

    progress:{type:Number, default:0}



}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema)
export default Task
