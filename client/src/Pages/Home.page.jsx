import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import Header from '../Components/Header.component';
import { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../config';
import useAuthStore from '../store/Auth.store.jsx';
import { useNavigate } from 'react-router-dom'; 

const Home = () => { 
    const [showPopup, setShowPopup] = useState(false);
    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [amount, setAmount] = useState(null);
    const [level, setLevel] = useState(null);
    const [teckstack, setTechstack] = useState("");
    const { userId } = useAuthStore();
    const navigate = useNavigate();

    const [myInterviews, setMyInterviews] = useState([]); 

    useEffect(() => {
        const getInterviews = async () => {
            try {
                const res = await axios.get(`${baseUrl}/interview/getAllInterviews`, { withCredentials: true });
                console.log(res.data);
                const all = res.data;
                const my = all.filter((interview) => interview.userId === userId);

                setMyInterviews(my); 
            }
            catch (err) {
                console.log("Error while fetching the all interviews.");
            }
        }
        getInterviews();
    }, []);

    const clickedSomeInterview = (id) => {
        navigate(`/interview/${id}`);
    }

    const clickedViewFeedback = (id)=>{
        navigate(`/interviewDetails/${id}`);
    }

    const submittedInterviewDetails = async (e) => {
        e.preventDefault();
        try {
            const seperatedStack = teckstack.split(",").map((str) => str.trim());
            console.log("seperated data:", seperatedStack);
            const res = axios.post(`${baseUrl}/interview/sendInterviewDetails`, {
                role,
                type,
                amount,
                level,
                techstack: seperatedStack
            }, { withCredentials: true });


            if (res.status === 201) {
                setRole("");
                setType("");
                setAmount(null);
                setLevel(null);
                setTechstack("");
            }
        }
        catch (err) {
            console.log("Interview details are failed to get sended...", err);
        }

        setShowPopup(false);
        window.location.reload();
    }

    return (
        <div className='bg-black'>
            <style>
                {`
                  .custom-placeholder::placeholder {
                    color: #ccc !important;
                    opacity: 1;
                   }
               `}
            </style>
            <div style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
                <Header />
            </div>
            <div className='bg-black' style={{ width: "100vw", paddingLeft: "10vw", paddingRight: "10vw" }}>

                <div className="d-flex gap-5 justify-content-center align-items-center rounded-4 p-3" style={{ backgroundImage: "linear-gradient(to bottom, #0A1931, black)" }}>
                    <div className='d-flex flex-column gap-3'>
                        <h3 className='text-white' style={{ fontSize: "38px" }}>Get Ready to Ace Your Next Interview</h3>
                        <p className='text-white'>
                            Practice real interview questions in a simulated environment. Speak your answers, get instant AI feedback, and boost your confidence.
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary rounded-pill"
                            style={{ backgroundColor: "#B9A9F7", color: "black", fontWeight: "bold", width: "170px" }}
                            onClick={() => setShowPopup(true)}
                        >
                            Get Started
                        </button>
                    </div>
                    <div>
                        <img src='/robot.png' width={"400px"} height={"400px"} alt="Robot" />
                    </div>
                </div>


                {/* Custom Popup */}
                {showPopup && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}>
                        <div className="p-5 rounded-4"
                            style={{
                                background: "linear-gradient(to bottom, #131417, #000000)",
                                width: "100%",
                                maxWidth: "440px",
                                border: "1px solid #2A2A2A",
                                boxShadow: "0 0 15px rgba(185, 169, 247, 0.1), 0 0 40px rgba(185, 169, 247, 0.08), 0 0 80px rgba(185, 169, 247, 0.05)"
                            }}>
                            <div className="text-center mb-4">
                                <h3 className="text-white fw-bold" style={{ fontSize: "28px" }}>Start Your Interview</h3>
                                <p className="text-white m-0" style={{ fontSize: "14px" }}>
                                    Fill in the required details to begin.
                                </p>
                            </div>

                            <form className="d-flex flex-column gap-3" onSubmit={(e) => submittedInterviewDetails(e)}>
                                <div className="d-flex flex-column gap-1">
                                    <label className="text-white">Role</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-0 rounded-pill px-3 custom-placeholder"
                                        placeholder="e.g. Frontend Developer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-flex flex-column gap-1">
                                    <label className="text-white">Type</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-0 rounded-pill px-3 custom-placeholder"
                                        placeholder="e.g. Technical, HR"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-flex flex-column gap-1">
                                    <label className="text-white">Level</label>
                                    <input
                                        type="number"
                                        className="form-control bg-dark text-white border-0 rounded-pill px-3 custom-placeholder"
                                        placeholder="Enter level (1 - 5)"
                                        min="1"
                                        max="5"
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-flex flex-column gap-1">
                                    <label className="text-white">Techstack</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-0 rounded-pill px-3 custom-placeholder"
                                        placeholder="e.g. React, Node.js, MongoDB"
                                        value={teckstack}
                                        onChange={(e) => setTechstack(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-flex flex-column gap-1">
                                    <label className="text-white">Amount</label>
                                    <input
                                        type="number"
                                        className="form-control bg-dark text-white border-0 rounded-pill px-3 custom-placeholder"
                                        placeholder="Number of questions"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-flex gap-3 justify-content-center mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-light rounded-pill px-3"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn rounded-pill px-3"
                                        style={{ backgroundColor: "#B9A9F7", color: "black", fontWeight: "bold" }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>


            {/* My interview's */}
            <div className='mt-4 pb-5' style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
                <div className='d-flex flex-column gap-4 p-3'>
                    <h3 className='text-white'>Your Interviews</h3>
                    {myInterviews.length === 0 ? <p className='text-white'>You haven't taken any interviews yet</p> :
                        <div className='d-flex gap-3 flex-wrap'>
                            {myInterviews.map((interview) => (
                                <div className="p-5 rounded-4 d-flex flex-column gap-2"
                                    key={interview._id}
                                    style={{
                                        background: "linear-gradient(to bottom, #131417, #000000)",
                                        border: "1px solid #2A2A2A",
                                        width: "24vw",
                                    }}>
                                    <img src='/roleImage.png' width={"60px"} height={"60px"} />
                                    <h3 className='text-white'>{interview.role} Interview</h3>
                                    <div className='d-flex gap-4'>
                                        <div className='d-flex gap-2'>
                                            <FaCalendarAlt style={{ color: "white", position: "relative", top: "4px" }} />
                                            <p className='text-white'>{new Date(interview.createdAt).toLocaleDateString('en-US')}</p>
                                        </div>

                                        <div className='d-flex gap-2'>
                                            <FaRegStar style={{ color: "white", position: "relative", top: "4px" }} />
                                            <p className='text-white'> {interview.feedback ? `${interview.feedback.overallImpression}/100` : "---/100" }</p>
                                        </div>
                                    </div>
                                    {!interview.feedback && <p className='text-white'>You haven’t attempted this interview yet. Take it now to boost your knowledge and confidence.</p>}
                                    {interview.feedback && <p className='text-white'>Interview completed! Take a moment to review and enhance your learning.</p>}
                                    
                                    <div className='d-flex justify-content-between gap-4'>
                                        {interview.feedback && <button
                                            type="button"
                                            className="btn btn-primary rounded-pill"
                                            style={{ backgroundColor: "#B9A9F7", color: "black", fontWeight: "bold", width: "170px" }}
                                            onClick={() => clickedViewFeedback(interview._id)}
                                        >
                                            view
                                        </button>}


                                        <button
                                            type="button"
                                            className="btn btn-primary rounded-pill"
                                            style={{ backgroundColor: "#B9A9F7", color: "black", fontWeight: "bold", width: "170px" }}
                                            onClick={() => clickedSomeInterview(interview._id)}
                                        >
                                            Start
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>}


                </div>
            </div>



        </div>

    );
};

export default Home;
