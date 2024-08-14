import "../../stlyes/header.css"
import {useState} from "react";
import icon from "../../images/pixelframe_icon.png";
import {Link, NavLink} from "react-router-dom";
import UserWidget from "./UserWidget";
import {RxHamburgerMenu} from "react-icons/rx";
import {useRecoilValue} from "recoil";
import {USER} from "../../util/dataStore";

export default function Header() {
    const [isExpanded, setExpanded] = useState(false);
    const user = useRecoilValue(USER);
    
    var collapseClasses =
        "Header-collapseYWrapper " + (isExpanded ? "Header-expandedY" : "Header-collapsedY");
    return (
        <div className="Header">
            <Link to="/" className="Header-title">
                <img src={icon} alt="PFM"/>
                <span>Pixelframe Marketing</span>
            </Link>
            <span className="Header-toggle" onClick={() => setExpanded(!isExpanded)}>
                <RxHamburgerMenu/>
            </span>
            <div className={"Header-contentWrapper " + collapseClasses}>
                <div className="Header-content ">
                    {user ?
                        <NavLink to="/dashboard" className="Header-link">
                            Dashboard
                        </NavLink> : ""
                    }
                    {user ?
                        <NavLink to="/browse" className="Header-link">
                            Browse
                        </NavLink> : ""
                    }
                    <UserWidget />
                </div>
            </div>
        </div>
    );
}
