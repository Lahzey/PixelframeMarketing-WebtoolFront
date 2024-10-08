import "../../stlyes/user-widget.css"
import {useRecoilState} from "recoil";
import {useRef, useState} from "react";
import {SHOW_LOGIN, USER} from "../../util/dataStore";
import {getImageUrl} from "../../util/apiRequests";
import {useNavigate} from "react-router-dom";
import {FaUserCircle} from "react-icons/fa";
import {Button} from "@chakra-ui/react";

export default function UserWidget(props) {
    const [user, setUser] = useRecoilState(USER);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [, setShowLogin] = useRecoilState(SHOW_LOGIN);
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
        setShowAccountInfo(false);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
        navigate("/");
    }
    
    const viewProfile = () => {
        setShowAccountInfo(false);
        navigate("/profile/" + user.id);
    }
    
    var accountInfo = "";
    
    let content;
    if (user) {
        content = (
            <div className="UserWidget-currentUser" onClick={toggleAccountInfo}>
                <span className="UserWidget-userName">{user.username}</span>
                <img className="UserWidget-userImage" src={getImageUrl(user.imageId)} alt="USER"/>
            </div>
        );
        accountInfo = (
            <div className="UserWidget-accountInfo" hidden={!showAccountInfo} style={{top: position}} ref={floatingRef}>
                <div className="UserWidget-accountInfoProfileLink" onClick={viewProfile}><FaUserCircle/> View Profile</div>
                <span className="UserWidget-accountInfoLogOutBtn button-outline light" onClick={logOut}>Log Out</span>
            </div>
        );
    } else {
        content = <Button colorScheme="gray" variant="outline" onClick={() => setShowLogin(true)}>Log In</Button>;
    }
    return (
        <div className="UserWidget" ref={targetRef}>
            {content}
            {accountInfo}
        </div>
    );
}