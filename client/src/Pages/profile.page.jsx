import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header.component.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../config';
import { FaCalendarAlt, FaRegStar } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import useAuthStore from '../store/Auth.store.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [myInterviews, setMyInterviews] = useState([]);
    const { userId, email, name, logOut } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const getInterviews = async () => {
            try {
                const res = await axios.get(`${baseUrl}/interview/getAllInterviews`, { withCredentials: true });
                const my = res.data.filter(interview => interview.userId === userId);
                setMyInterviews(my);
            } catch (err) {
                console.log("Error while fetching interviews.");
            }
        };
        getInterviews();
    }, []);

    const handleLogout = async()=>{
        await logOut();
    }

    const handleStartInterview = (id) => navigate(`/interview/${id}`);
    const handleViewFeedback = (id) => navigate(`/interviewDetails/${id}`);

    return (
        <div className='bg-black min-vh-100' style={{ padding: "3rem 5vw" }}>
            <Header />

            <div className="row mt-1 g-5">

                {/* Left: Interviews */}
                <div className="col-lg-8">
                    <h3 className="text-white mb-4">Your Interviews</h3>

                    {myInterviews.length === 0 ? (
                        <p className="text-white">You haven't taken any interviews yet.</p>
                    ) : (
                        <div className="row g-4">
                            {myInterviews.map(interview => (
                                <div className="col-md-6" key={interview._id}>
                                    <div className="p-4 rounded-4 h-100" style={{
                                        background: "linear-gradient(to bottom, #1c1e22, #0f0f0f)",
                                        border: "1px solid #2A2A2A"
                                    }}>
                                        <img src="/roleImage.png" width="50" height="50" className="mb-3" alt="role" />
                                        <h5 className="text-white">{interview.role} Interview</h5>

                                        <div className="d-flex justify-content-between text-white small mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <FaCalendarAlt />
                                                <span>{new Date(interview.createdAt).toLocaleDateString('en-US')}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaRegStar />
                                                <span>{interview.feedback ? `${interview.feedback.overallImpression}/100` : "---/100"}</span>
                                            </div>
                                        </div>

                                        <p className="text-white small">
                                            {!interview.feedback
                                                ? "You haven’t attempted this interview yet. Take it now to boost your knowledge and confidence."
                                                : "Interview completed! Take a moment to review and enhance your learning."}
                                        </p>

                                        <div className="d-flex gap-2 mt-3">
                                            {interview.feedback && (
                                                <button
                                                    className="btn btn-outline-light rounded-pill flex-fill"
                                                    onClick={() => handleViewFeedback(interview._id)}
                                                >
                                                    View Feedback
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-light text-dark rounded-pill flex-fill"
                                                onClick={() => handleStartInterview(interview._id)}
                                            >
                                                {interview.feedback ? "Retake" : "Start"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Profile Info */}
                <div className="col-lg-4">
                    <div className="p-4 rounded-4 text-white" style={{
                        background: "linear-gradient(to bottom, #1c1e22, #0f0f0f)",
                        border: "1px solid #2A2A2A",
                        minHeight: "50vh",
                        marginTop: "8vh"
                    }}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <CgProfile size={60} />
                            <h5 className="mb-0">Profile Info</h5>
                        </div>
                        <hr className='border-light' />
                        <p className="mb-2"><strong>Name:</strong> {name}</p>
                        <p className="mb-0"><strong>Email:</strong> {email}</p>
                        <button
                            className="btn btn-outline-danger rounded-pill px-4 py-2 fw-bold mt-3"
                            style={{
                                border: '2px solid #FF4C61',
                                color: '#FF4C61',
                                backgroundColor: 'transparent',
                                transition: 'all 0.3s ease-in-out',
                            }}
                            onClick={handleLogout} >
                            Log Out
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
