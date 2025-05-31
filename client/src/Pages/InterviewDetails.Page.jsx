import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt, FaRegStar } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import baseUrl from "../config";
import { useNavigate } from 'react-router-dom';

const InterviewDetails = () => {
    const { id } = useParams();
    const [interviewDetails, setInterviewDetails] = useState(null);
    const navigate = useNavigate();

    const clickedGotoDashboard = () => {
        navigate("/");
    }

    const clickedTakeInterview = (id) => {
        navigate(`/interview/${id}`);
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/interview/getSingleInterviewDetails/${id}`, { withCredentials: true });
                if (res.status === 200) {
                    setInterviewDetails(res.data);
                } else {
                    console.log("Failed to get the details. Res is:", res.data);
                }
            } catch (err) {
                console.log("Error while fetching data in the interviewDetails page:", err);
            }
        };
        getData();
    }, []);

    if (!interviewDetails || !interviewDetails.feedback) return <div className="text-white p-5">Loading...</div>;

    const { role, createdAt, type, amount, level, techstack, feedback } = interviewDetails;
    const scores = feedback.scores || {};
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US');

    return (
        <div className="bg-black text-white min-vh-100 py-5 d-flex flex-column align-items-center">
            <div className="w-75  p-4 rounded-4 shadow" style={{ background: "linear-gradient(to bottom, #131417, #000000)", boxShadow: "0 0 15px rgba(185, 169, 247, 0.1), 0 0 40px rgba(185, 169, 247, 0.08), 0 0 80px rgba(185, 169, 247, 0.05)" }}>
                <div className="text-center">
                    <img src="/roleImage.png" alt="Role" className="mb-3" width={100} height={100} />
                    <h2 className="fw-bold">{role}</h2>
                    <div className="d-flex justify-content-center gap-4 my-3">
                        <div className="d-flex align-items-center gap-2">
                            <FaCalendarAlt />
                            <span>{formatDate(createdAt)}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <FaRegStar />
                            <span>{feedback.overallImpression}/100</span>
                        </div>
                    </div>
                </div>
                <hr className="border-secondary" />

                <div className="row text-center mb-4">
                    <div className="col-md-3">
                        <h6 className="text-white">Type</h6>
                        <p style={{ color: "#9ca3af" }}>{type}</p>
                    </div>
                    <div className="col-md-3">
                        <h6 className="text-white">Amount</h6>
                        <p style={{ color: "#9ca3af" }}>{amount}</p>
                    </div>
                    <div className="col-md-3">
                        <h6 className="text-white">Level</h6>
                        <p style={{ color: "#9ca3af" }}>{level}</p>
                    </div>
                    <div className="col-md-3">
                        <h6 className="text-white">Tech Stack</h6>
                        <p style={{ color: "#9ca3af" }}>{techstack.join(', ')}</p>
                    </div>
                </div>

                <div className="my-4">
                    <h2 className="mb-3">Feedback Summary</h2>
                    <p style={{ color: "#9ca3af" }}>{feedback.summary}</p>
                </div>


                <h2 className='mb-3'>Breakdown of the Interview:</h2>
                <div className='d-flex flex-column gap-3'>
                    {Object.entries(scores).map(([key, { score, feedback }], idx) => (
                        <div>
                            <h6 className="text-uppercase">{key.replace(/([A-Z])/g, ' $1')} ({score}/100)</h6>
                            <p className="small mt-2" style={{ color: "#9ca3af" }}>{feedback}</p>
                        </div>
                    ))}
                </div>

                {feedback.strengths?.length > 0 && (
                    <div className="mt-4">
                        <h5>Strengths</h5>
                        <ul>
                            {feedback.strengths.map((point, i) => (
                                <li key={i} style={{ color: "#9ca3af" }}>{point}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {feedback.areasForImprovement?.length > 0 && (
                    <div className="mt-4">
                        <h5>Areas for Improvement</h5>
                        <ul>
                            {feedback.areasForImprovement.map((point, i) => (
                                <li key={i} style={{ color: "#9ca3af" }}>{point}</li>
                            ))}
                        </ul>
                    </div>
                )}


                <div className='d-flex gap-3 justify-content-center mt-5'>
                    <button
                        type="button"
                        className="btn btn-primary rounded-pill"
                        style={{ backgroundColor: "#131417", color: "#9ca3af",width:"50%",  border:"none" }}
                        onClick={() => clickedGotoDashboard()}
                    >
                        Back to dashboard
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded-pill"
                        style={{ backgroundColor: "#B9A9F7", color: "black",width:"50%",  border:"none" }}
                        onClick={() => clickedTakeInterview(interviewDetails._id)}
                    >
                        Retake Interview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewDetails;
