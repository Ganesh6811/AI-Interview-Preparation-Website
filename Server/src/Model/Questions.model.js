import mongoose from "mongoose";

const QuestionsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    role: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
    },

    level: {
        type: Number,
        required: true,
    },

    techstack: {
        type: [String],
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    feedback: {
        type: {
            overallImpression: {
                type: Number,
            },
            summary: {
                type: String,
            },
            scores: {
                communicationSkills: {
                    score: { type: Number },
                    feedback: { type: String },
                },
                technicalKnowledge: {
                    score: { type: Number },
                    feedback: { type: String },
                },
                problemSolving: {
                    score: { type: Number },
                    feedback: { type: String },
                },
                culturalFit: {
                    score: { type: Number },
                    feedback: { type: String },
                },
                confidenceAndClarity: {
                    score: { type: Number },
                    feedback: { type: String },
                },
            },
            strengths: {
                type: [String],
                default: [],
            },
            areasForImprovement: {
                type: [String],
                default: [],
            },
            timestamp: {
                type: Date,
                default: Date.now,
            }
        },

        default: null,
    },
}, {timestamps:true});

const QuestionsModel = mongoose.model("Questions", QuestionsSchema);

export default QuestionsModel;
