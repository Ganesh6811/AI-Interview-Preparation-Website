import { useParams, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { IoMicCircleOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import baseUrl from "../config";
import Vapi from '@vapi-ai/web';
import useAuthStore from "../store/Auth.store.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const Interview = () => {
    const { id } = useParams();
    const [isStarted, setIsStarted] = useState(false);
    const [isSpeechStarted, setIsSpeechStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [subtitles, setSubtitles] = useState("");
    const [responses, setResponses] = useState("");
    const navigate = useNavigate();
    const callRef = useRef(null);
    const { name } = useAuthStore();

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/interview/getInterviewQuestions/${id}`, { withCredentials: true });
                if (res.status === 200) {
                    setQuestions(res.data);
                }
            } catch (err) {
                console.log("Error while fetching the questions:", err);
            }
        };
        getData();
    }, [id]);

    const startInterview = async () => {
        const questionsList = questions.map((q, index) => `${index + 1}. ${q}`).join("\n");
        callRef.current = new Vapi(process.env.REACT_APP_VAPI_API_KEY); // ✅ Use ref

        const assistantOverrides = {
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en-US",
            },
            model: {
                provider: "google",
                model: "gemini-1.5-pro-002",
                messages: [
                    {
                        role: "system",
                        content: `You are a professional interviewer named Alice, helping candidates prepare for real job interviews.
                        You speak in a clear, confident, and encouraging tone. You will greet the candidate, then ask the following questions one by one. Wait for their complete response before moving to the next.
                        Here are the interview questions to ask:${questionsList}
                        Do not skip any questions. Be empathetic if the user struggles, but maintain a professional and supportive tone.`,
                    }
                ]
            },
            voice: {
                provider: "playht",
                voiceId: "jennifer",
            },
            name: "Alice",
            firstMessage: "Hello, I'm Alice, your professional interview assistant. Let's begin your mock interview.",
            firstMessageMode: "assistant-speaks-first",
        };

        await callRef.current.start(process.env.REACT_APP_VAPI_ASSISTANT_ID, assistantOverrides); // ✅ Use ref

        callRef.current.on("speech-start", ()=>{
            setIsSpeechStarted(true);
        });
    

        callRef.current.on("speech-end", ()=>{
            setIsSpeechStarted(false);
        });


        callRef.current.on("message", (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setSubtitles(message.transcript);
                setResponses((prev) => prev + message.transcript);
            }
        });
    };

    const endInterview = () => {
        if (callRef.current) {
            callRef.current.stop(); // ✅ Use ref
        }
        console.log("Interview Responses:", responses);
        callStopped();
        setIsStarted(false);
    };

    const callStopped = async () => {
        try {
            const res = await axios.post(`${baseUrl}/interview/saveInterviewFeedback`, {
                questions,
                responses,
                id
            }, { withCredentials: true });

            if (res.status === 201) {
                console.log("Feedback is saved successfully");
            }
        } catch (err) {
            console.log("Error in the interview page:", err);
            navigate("/");
        }

        navigate(`/interviewDetails/${id}`);
    };

    const clickedStartButton = () => {
        if (!isStarted) {
            setIsStarted(true);
            startInterview();
        } else {
            endInterview();
        }
    };

    return (
        <div className="bg-black" style={{ width: "100vw", height: "100vh" }}>
            <div className="d-flex justify-content-between pt-5" style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
                <h2 className="text-white">InterviewPrep</h2>
                <BsPersonCircle className="mt-2" style={{ color: "white", width: "40px", height: "40px" }} />
            </div>

            <div className="d-flex gap-5 mt-5" style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
                <div className="d-flex justify-content-center align-items-center rounded-4" style={{ border: "1px solid #2A2A2A", width: "40vw", height: "55vh", background: "linear-gradient(to bottom,  #1B183F, #000000)", boxShadow: isSpeechStarted ? "0 0 20px rgba(185, 169, 247, 0.4), 0 0 60px rgba(185, 169, 247, 0.3), 0 0 100px rgba(185, 169, 247, 0.2)" : "0 0 15px rgba(185, 169, 247, 0.1), 0 0 40px rgba(185, 169, 247, 0.08), 0 0 80px rgba(185, 169, 247, 0.05)"  }}>
                    <div className="d-flex flex-column gap-2 align-items-center">
                        <img src="/microphone.png" width={"100px"} height={"100px"} />
                        <p
                            className="text-white fw-semibold fs-5"
                            style={{
                                letterSpacing: "0.5px",
                                textShadow: "0 0 4px rgba(255, 255, 255, 0.2)",
                                maxWidth: "30vw",
                                lineHeight: "1.5",
                                margin: 0,
                            }}
                        >
                            AI Interviewer
                        </p>
                    </div>
                </div>
                <div className=" d-flex justify-content-center align-items-center rounded-4" style={{ border: "1px solid #2A2A2A", width: "40vw", height: "55vh", background: "linear-gradient(to bottom, #131417, #000000)", }}>
                    <div className="d-flex flex-column gap-2 align-items-center">
                        <img src="/person.png" width={"100px"} height={"100px"} />
                        <p
                            className="text-white fw-semibold fs-5"
                            style={{
                                letterSpacing: "0.5px",
                                textShadow: "0 0 4px rgba(255, 255, 255, 0.2)",
                                maxWidth: "30vw",
                                lineHeight: "1.5",
                                margin: 0,
                            }}
                        >
                            {name}
                        </p>
                    </div>
                </div>
            </div>


            {subtitles !== "" && <div className="pt-4" style={{ paddingLeft: "11vw", paddingRight: "11vw" }}>
                <p className=" d-flex justify-content-center align-items-center rounded-4" style={{ border: "1px solid #2A2A2A", height:"6vh",color:"#F8F8FF",  background: "linear-gradient(to bottom, #131417, #000000)", }}
                >{subtitles}</p>
            </div>}

            <div className="text-center mt-5">
                <button type="button" className={`btn px-4 py-2 fw-bold rounded-pill shadow-sm ${isStarted ? "btn-danger" : "btn-success"}`} style={{ transition: "all 0.3s ease", fontSize: "1.1rem", letterSpacing: "0.5px" }} onClick={clickedStartButton}>
                    {isStarted ? "End" : "Start"}
                </button>
            </div>
        </div>
    );
};

export default Interview;
