import "../stlyes/home.css";
import {useRecoilState} from "recoil";
import {USER} from "../util/dataStore";
import {Link} from "react-router-dom";
import {useState} from "react";
import LoginPopup from "./components/LoginPopup";
import icon from "../images/pixelframe_icon.png";

export default function Home() {
    const [user, setUser] = useRecoilState(USER);
    const [loginForward, setLoginForward] = useState("");
    
    return (
        <div className="Home">
            <div className="Home-header">
                <img src={icon} alt="Logo" width={64} height={64}/>
                <span>Pixelframe Marketing</span>
            </div>
            <div className="Home-trailerContainer">
                <video preload="auto" autoPlay loop="loop" muted="muted">
                    <source src="https://media.sciencephoto.com/image/k0054472/preview/K0054472-Apollo_11_Saturn_V_launch_close-up,_1969.mp4" type="video/mp4"/>
                    Sorry, your browser does not support HTML5 video.
                </video>
            </div>

            <div className="Home-content">
                <div className="Home-leftLinkContainer">
                    {user ?
                        <Link to="/browse" className="Home-guideLink">
                            <span className="Home-guideLinkArrowRight">{">"}</span>
                            <span className="Home-guideLinkLabelRight">Browse</span>
                        </Link> :
                        <span onClick={() => setLoginForward("GAME_DEV")} className="Home-guideLink">
                            <span className="Home-guideLinkArrowRight">{">"}</span>
                            <span className="Home-guideLinkLabelRight">Browse</span>
                        </span>
                    }
                </div>
                <div className="Home-rightLinkContainer">
                    {user ?
                        <Link to="/dashboard" className="Home-guideLink">
                            <span className="Home-guideLinkLabelLeft">Dashboard</span>
                            <span className="Home-guideLinkArrowLeft">{"<"}</span>
                        </Link> :
                        <span onClick={() => setLoginForward("ADVERTISER")} className="Home-guideLink">
                            <span className="Home-guideLinkLabelLeft">Dashboard</span>
                            <span className="Home-guideLinkArrowLeft">{"<"}</span>
                        </span>
                    }
                </div>
            </div>

            {loginForward ? <LoginPopup close={() => setLoginForward("")} showRegister registerRole={loginForward} /> : ""}
        </div>
    );
}
  