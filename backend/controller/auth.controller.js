import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res) => {
    const { name, email, password, profileImageUrl, adminJoinCode } = req.body;

    try {
        //  validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        //  check existing user
        const isAlreadyExist = await User.findOne({ email });

        if (isAlreadyExist) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        //  role logic
        let role = "user";
        if (adminJoinCode && adminJoinCode === process.env.ADMIN_JOIN_CODE) {
            role = "admin";
        }

        // hash password (async)
        const hashedPassword = await bcryptjs.hash(password, 10);

        // create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        await newUser.save();

        // ✅ response
        return res.status(201).json({
            message: "Signup successful",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ messsage: "All fileds are required" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email" })
        }

        //compare password
        const validPassword = bcryptjs.compareSync(password, user.password)
        if (!validPassword) {
            return next(errorHandler(400, "Wrong Credentials"))
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = user._doc

        res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest)

    } catch (error) {
        next(error)
    }
}

export const userProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return next(errorHandler(401, "User Not found!"))

        }
        const { password: pass, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)

    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return next(errorHandler(404, "User not found!"))
        }
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updateUser = await user.save()
        const { password: pass, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(errorHandler(400, "No file uploaded"))
        }

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename
            }`

        res.status(200).json({ imageUrl })
    } catch (error) {
        next(error)
    }
}


export const signout = async (req, res, next) => {
    try {
        res
            .clearCookie("access_token")
            .status(200)
            .json("User has been logged out successfully!")
    } catch (error) {
        next(error)
    }
}