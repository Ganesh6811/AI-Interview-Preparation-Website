import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Header = ()=>{
    const navigate = useNavigate();

    const clickedProfile = ()=>{
        navigate("/profile");
    }

    const clickedHome = ()=>{
        navigate("/");
    }

    return(<div>
        <div className="d-flex justify-content-between p-5">
            <h2 className="text-white" style={{cursor:"pointer"}} onClick={()=>clickedHome()}>InterviewPrep</h2>
            <BsPersonCircle style={{color:"white", width:"40px", height:"40px", cursor:"pointer"}} width={"50px"} height={"50px"} onClick={()=>(clickedProfile())} />
        </div>
    </div>)
};

export default Header;