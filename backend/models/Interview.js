import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({

    question: {

        type: String,

        required: true

    },

    answer: {

        type: String,

        default: ""

    }

});

const interviewSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User"

    },

    resumeAnalysis: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "ResumeAnalysis"

    },

    company: {

        type: String,

        required: true

    },

    role: {

        type: String,

        required: true

    },

    experience: {

        type: String,

        default: ""

    },

    difficulty: {

        type: String,

        default: ""

    },

    answers: [

        answerSchema

    ],

    transcript: {

        type: String,

        default: ""

    },

    overallScore: {

        type: Number,

        default: 0

    },

    communication: {

        type: Number,

        default: 0

    },

    technical: {

        type: Number,

        default: 0

    },

    confidence: {

        type: Number,

        default: 0

    },

    grammar: {

        type: Number,

        default: 0

    },

    feedback: {

        type: String,

        default: ""

    },

    duration: {

        type: Number,

        default: 0

    },

    status: {

        type: String,

        enum: [

            "Completed",

            "Pending"

        ],

        default: "Completed"

    }

}, {

    timestamps: true

});

export default mongoose.model(

    "Interview",

    interviewSchema

);