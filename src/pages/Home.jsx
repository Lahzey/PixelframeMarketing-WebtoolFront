import "../stlyes/home.css";
import {useRecoilState} from "recoil";
import {LOGIN_REGISTER_ROLE, LOGIN_SHOW_REGISTER, SHOW_LOGIN, USER} from "../util/dataStore";
import {Link} from "react-router-dom";
import icon from "../images/pixelframe_icon.png";
import trailer from "../images/trailer.mp4"

export default function Home() {
    const [user, setUser] = useRecoilState(USER);
    const [, setShowLogin] = useRecoilState(SHOW_LOGIN);
    const [, setRegisterMode] = useRecoilState(LOGIN_SHOW_REGISTER);
    const [, setRegisterRole] = useRecoilState(LOGIN_REGISTER_ROLE);
    
    const registerAs = (role) => {
        setShowLogin(true);
        setRegisterMode(true);
        setRegisterRole(role);
    }
    
    return (
        <div className="Home">
            <div className="Home-header">
                <img src={icon} alt="Logo" width={64} height={64}/>
                <span>Pixelframe Marketing</span>
            </div>
            <div className="Home-trailerContainer">
                <video preload="auto" autoPlay loop="loop" muted="muted">
                    <source src={trailer} type="video/mp4"/>
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
                        <span onClick={() => registerAs("GAME_DEV")} className="Home-guideLink">
                            <span className="Home-guideLinkArrowRight">{">"}</span>
                            <span className="Home-guideLinkLabelRight">Im an Indie Dev</span>
                        </span>
                    }
                </div>
                <div className="Home-rightLinkContainer">
                    {user ?
                        <Link to="/dashboard" className="Home-guideLink">
                            <span className="Home-guideLinkLabelLeft">Dashboard</span>
                            <span className="Home-guideLinkArrowLeft">{"<"}</span>
                        </Link> :
                        <span onClick={() => registerAs("ADVERTISER")} className="Home-guideLink">
                            <span className="Home-guideLinkLabelLeft">I want to Advertise</span>
                            <span className="Home-guideLinkArrowLeft">{"<"}</span>
                        </span>
                    }
                </div>
            </div>
        </div>
    );
}
  