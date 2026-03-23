import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"

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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = user._doc

        res.status(200).cookie("acesss_token", token, { httpOnly: true }).json(rest)

    } catch (error) {
        next(error)
    }
}