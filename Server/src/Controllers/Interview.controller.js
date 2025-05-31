import InterviewDetails from "../Model/Questions.model.js";
import { GoogleGenAI } from "@google/genai";

export const saveInterviewDetails = async (req, res) => {
    const { role, type, level, techstack, amount } = req.body;

    try {
        if (!role || !type || !level || !techstack || !amount) {
            return res.status(400).json({ message: "All fields are required..." });
        }

        const data = new InterviewDetails({
            userId: req.user._id,
            role,
            type,
            level,
            techstack,
            amount,
        });

        await data.save();
        res.status(201).json({ data });
    }
    catch (err) {
        console.log("Error in saveInterviewDetals controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getSingleInterviewDetails = async(req, res)=>{
    const id = req.params.id;

    try{
        const interview = await InterviewDetails.findById(id);
        if(!interview){
            return res.status(400).json({message:"Interview details are not found"});
        }

        res.status(200).json(interview);
    }
    catch(err){
        console.log("Error in getSingleInterviewDetails:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
}


export const getAllInterviews = async (req, res) => {
    try {
        const response = await InterviewDetails.find().lean();
        return res.status(200).json(response);
    }
    catch (err) {
        console.log("Error in sendAllInterviews:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




export const getInterviewQuestions = async (req, res) => {
    const id = req.params.id;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

    try {
        const interview = await InterviewDetails.findOne({ _id: id });
        if (!interview) return res.status(404).json({ message: "Interview not found" });

        const { role, type, level, techstack, amount } = interview;

        const prompt = `You are an expert technical interviewer.
        Generate exactly ${amount} interview questions for the role of a ${role} in the ${type} domain. The questions should be suitable for a candidate at level ${level} and focus on the following tech stack: ${techstack}.
        Return only a JSON array of questions in the following format:
        [
         "Question 1: ...",
         "Question 2: ...",
         ...
        ]
         Do not include any explanation or extra text outside the array. Also, do NOT wrap the JSON array in markdown code blocks (like \`\`\`json).`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        const responseText = response.text;
        const jsonStartIndex = responseText.indexOf('[');
        if (jsonStartIndex === -1) {
            throw new Error("JSON array not found in response");
        }
        let jsonArrayText = responseText.slice(jsonStartIndex);


        jsonArrayText = jsonArrayText.replace(/```json\s*|```/g, '').trim();

        let questions = JSON.parse(jsonArrayText);
        questions = questions.map(q => q.replace(/^Question \d+:\s*/, ''));

        res.status(200).json(questions);

    } catch (err) {
        console.error("Error in getInterviewQuestions controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




export const saveInterviewFeedback = async (req, res) => {
  const { questions, responses, id } = req.body;

  if (!questions || !responses || !id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

  try {
    const interview = await InterviewDetails.findById(id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const joinQUestions = questions.reduce((acc, curr, i) => {
      return acc + `Q${i + 1}: ${curr}.\n`;
    }, "");

    const prompt = `
You are a strict professional technical interviewer. Your task is to evaluate the candidate's performance based on the interview transcript.

Use the following information:
- List of questions asked:
${joinQUestions}

- Full conversation between the AI interviewer and the candidate:
"""
${responses}
"""

Provide a detailed, perfect and constructive evaluation with big feedback sentance in the following JSON format. All scores must be on a scale from 1 to 100.

Return ONLY a valid JSON object structured like this:

{
  "overallImpression": 85,
  "summary": "Candidate gave thoughtful responses and demonstrated solid technical understanding...",
  "scores": {
    "communicationSkills": {
      "score": 88,
      "feedback": "Clear, structured, and articulate"
    },
    "technicalKnowledge": {
      "score": 82,
      "feedback": "Good problem-solving with practical knowledge"
    },
    "problemSolving": {
      "score": 79,
      "feedback": "Approaches problems methodically"
    },
    "culturalFit": {
      "score": 91,
      "feedback": "Friendly and professional attitude"
    },
    "confidenceAndClarity": {
      "score": 76,
      "feedback": "Generally confident but a little hesitant in deep topics"
    }
  },
  "strengths": ["Articulate communication", "Strong fundamentals"],
  "areasForImprovement": ["Expand knowledge in algorithms", "Improve response clarity under pressure"]
}

Important: Return the JSON only. Do not include any explanations or commentary outside the JSON.
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // STEP 4: Clean and parse Gemini output
    let responseText = response.text;

    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
    }

    let feedbackData;
    try {
      feedbackData = JSON.parse(responseText);
    } catch (err) {
      console.error("Failed to parse Gemini output:", err);
      console.log("Gemini raw output:", responseText);
      return res.status(500).json({ message: "Failed to parse AI feedback" });
    }

    // STEP 5: Save feedback to DB
    interview.feedback = {
      ...feedbackData,
      timestamp: new Date(),
    };

    await interview.save();

    res.status(201).json({
      message: "Feedback saved successfully",
      feedback: interview.feedback,
    });

  } catch (err) {
    console.error("Error in saveInterviewFeedback:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
