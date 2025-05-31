import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import baseUrl from "../config.jsx";
import axios from "axios";
import useAuthStore from "../store/Auth.store.jsx";

const SignUpPage = () => {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { fetchUser } = useAuthStore();

    const clickedLogin = async() => {
        navigate("/login");
    };

    const formSubmit = async () => {
        if (!email || !password || !name) {
            setName("");
            setEmail("");
            setPassword("");
        }
        else {
            try {
                const res = await axios.post(`${baseUrl}/auth/signUp`,
                    {
                        email,
                        password,
                        name,
                    },
                    { withCredentials: true }
                );

                if (res.status === 201) {
                    await fetchUser();
                    navigate("/");
                }
            }
            catch (err) {
                console.log("SignUp failed");
                setEmail("");
                setPassword("");
                setName("");
            }
        }
    }

    return (
        <div className="bg-black d-flex justify-content-center align-items-center" style={{ height: "100vh", width: "100vw" }}>
            <div className="p-5 rounded-4"
                style={{
                    background: "linear-gradient(to bottom, #131417, #000000)",
                    width: "100%",
                    maxWidth: "420px",
                    border: "1px solid #2A2A2A",
                    boxShadow: "0 0 15px rgba(185, 169, 247, 0.1), 0 0 40px rgba(185, 169, 247, 0.08), 0 0 80px rgba(185, 169, 247, 0.05)"
                }}
            >
                <div className="text-center mb-4">
                    <h3 className="text-white fw-bold" style={{ fontSize: "28px" }}>InterviewPrep</h3>
                    <p className="text-white m-0" style={{ fontSize: "14px" }}>Practice your interviews and forget the fear</p>
                </div>

                <form className="d-flex flex-column gap-3" onSubmit={(e) => { e.preventDefault(); formSubmit(); }}>
                    <div className="d-flex flex-column gap-1">
                        <label className="text-white">Name</label>
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-0 rounded-pill px-3"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="d-flex flex-column gap-1">
                        <label className="text-white">Email</label>
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-0 rounded-pill px-3"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="d-flex flex-column gap-1 mb-3">
                        <label className="text-white">Password</label>
                        <input
                            type="password"
                            className="form-control bg-dark text-white border-0 rounded-pill px-3"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary rounded-pill"
                        style={{ backgroundColor: "#B9A9F7", color: "black", fontWeight: "bold" }}
                    >
                        Create an Account
                    </button>
                </form>

                <p className="text-center mt-3 text-white" style={{ fontSize: "14px" }}>
                    Have an account already? <a href="#signIn" onClick={clickedLogin} role="button" style={{ color: "#B9A9F7", cursor: "pointer" }}>Sign In</a>
                </p>
            </div>
        </div>
    );
}

export default SignUpPage;
