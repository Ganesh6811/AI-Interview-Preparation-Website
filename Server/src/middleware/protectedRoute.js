import jwt from "jsonwebtoken";
import User from "../Model/User.model.js";

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(400).json({ message: "Unauthorized access - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECREATE_KEY);
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(400).json("Unauthorized access - Data is not found");
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in the protected Route:", error);
        res.status(400).json({ message: "Internal Server error" });
    }
}


export default protectedRoute;