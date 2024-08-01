import "../../stlyes/user-widget.css"
import {useRecoilState} from "recoil";
import {useRef, useState} from "react";
import LoginPopup from "./LoginPopup";
import {USER} from "../../util/dataStore";
import {getImageUrl} from "../../util/apiRequests";
import {useNavigate} from "react-router-dom";

export default function UserWidget(props) {
    const [user, setUser] = useRecoilState(USER);
    const [showLogin, setShowLogin] = useState(false);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const navigate = useNavigate();

    const targetRef = useRef(null);
    const floatingRef = useRef(null);
    const [position, setPosition] = useState(0);

    const toggleAccountInfo = () => {
        const target = targetRef.current;
        const floating = floatingRef.current;

        if (!showAccountInfo && target && floating) {
            const targetRect = target.getBoundingClientRect();
            const containerRect = target.parentNode.getBoundingClientRect();

            setPosition(targetRect.bottom - containerRect.top);
        }
        setShowAccountInfo(!showAccountInfo);
    };
    
    const logOut = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
        navigate("/");
    }
    
    var accountInfo = <div className="UserWidget-accountInfo" hidden={!showAccountInfo} style={{top: position}} ref={floatingRef}><span className="button-outline light" onClick={logOut}>Log Out</span></div>
    
    var content = [];
    if (user) {
        content.push(<span className="UserWidget-userName">{user.username}</span>);
        content.push(<img className="UserWidget-userImage" src={getImageUrl(user.imageId)} alt="USER"/>);
        content.push(accountInfo);
    } else {
        content.push(<span className="UserWidget-loginButton" onClick={() => setShowLogin(true)}>Log In</span>);
    }
    return (
        <div className="UserWidget" onClick={toggleAccountInfo} ref={targetRef}>
            {showLogin ? <LoginPopup close={() => setShowLogin(false)}/> : ""}
            {content}
        </div>
    );
}