import "../../stlyes/header.css"
import {useState} from "react";
import icon from "../../images/pixelframe_icon.png";
import {Link, NavLink} from "react-router-dom";
import UserWidget from "./UserWidget";

export default function Header() {
    const [isExpanded, setExpanded] = useState(false);
    var collapseClasses =
        "Header-collapseYWrapper " + (isExpanded ? "Header-expandedY" : "Header-collapsedY");
    return (
        <div className="Header">
            <Link to="/" className="Header-title">
                <img src={icon} alt="PFM"/>
                <span>Pixelframe Marketing</span>
            </Link>
            <span className="Header-toggle" onClick={() => setExpanded(!isExpanded)}>
                X
            </span>
            <div className={"Header-contentWrapper " + collapseClasses}>
                <div className="Header-content ">
                    <NavLink to="/dashboard" className="Header-link">
                        Dashboard
                    </NavLink>
                    <NavLink to="/browse" className="Header-link">
                        Browse
                    </NavLink>
                    <UserWidget />
                </div>
            </div>
        </div>
    );
}
