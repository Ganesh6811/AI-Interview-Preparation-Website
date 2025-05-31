import { Router } from "express";
import protectedRoute from "../middleware/protectedRoute.js";
import { getAllInterviews, saveInterviewDetails , getInterviewQuestions, getSingleInterviewDetails, saveInterviewFeedback} from "../Controllers/Interview.controller.js";

const route = Router();

route.post("/sendInterviewDetails", protectedRoute, saveInterviewDetails);
route.get("/getAllInterviews", protectedRoute, getAllInterviews);
route.get("/getInterviewQuestions/:id", protectedRoute, getInterviewQuestions);
route.get("/getSingleInterviewDetails/:id", protectedRoute, getSingleInterviewDetails);
route.post("/saveInterviewFeedback", protectedRoute, saveInterviewFeedback);

export default route;