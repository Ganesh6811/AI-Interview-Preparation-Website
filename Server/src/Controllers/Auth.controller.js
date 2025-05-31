import generateToken from "../lib/utils.js";
import User from "../Model/User.model.js"; 
import bcrypt from "bcrypt";


export const  signUp = async(req, res)=>{
    const {name, email, password} = req.body;

    try{
        if(!name || !email|| !password){
            return res.status(400).json({message:"All fileds are required"});
        }

        const checkMail = await User.findOne({email});
        if(checkMail){
            return res.status(400).json({message:"Email is already used"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = new User({
            name,
            email,
            password:hashedPassword
        });

        await userData.save();

        generateToken(userData, res);

        res.status(201).json({
            id:userData._id,
            name:userData.name,
            email:userData.email,
        });
    }
    catch(err){
        console.log("Error in the signUp controller:", err);
        res.status(500).json({message:"Internal server error"});
    }
}


export const login = async(req, res)=>{
    const {email, password} = req.body;

    try{
        if(!email || !password){
            return res.status(400).json({message:"All fields are required."});
        }

        const checkData = await User.findOne({email});
        if(!checkData){
            return res.status(400).json({message:"Creadentails are wrong.."})
        }

        const checkPassword = await bcrypt.compare(password, checkData.password);
        if(checkPassword){
            generateToken(checkData, res);
            console.log("Logged In successfully.....");
            return res.status(204).json({
                id:checkData._id,
                name:checkData.name,
                email:checkData.email,
            });
        }
        else{
            return res.status(400).json({message:"Credentails are wrong...."});
        }

    }
    catch(err){
        console.log("Error in the login controller:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
}


export const logOut = async(req, res)=>{
    try{ 
        res.cookie("jwt", "", {maxAge: 0});
    }
    catch(err){
        console.log("Error in logOut controller:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const checkAuth = async(req, res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("Error in the checkAuth controller:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
}