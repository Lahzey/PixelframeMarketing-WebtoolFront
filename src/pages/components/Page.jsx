import Header from "./Header";
import Footer from "./Footer";
import {useEffect} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {SHOW_LOGIN, TITLE_OVERRIDE, USER} from "../../util/dataStore";

export default function Page({children, title, header, footer, requireLogin, defaultPadding = true}) {
    const titleOverride = useRecoilValue(TITLE_OVERRIDE);
    const user = useRecoilValue(USER);
    const [, setShowLogin] = useRecoilState(SHOW_LOGIN);
    
    useEffect(() => {
        const baseTitle = "Pixelframe Marketing";
        if (titleOverride) document.title = titleOverride + " - " + baseTitle;
        else if (title) document.title = title + " - " + baseTitle;
        else document.title = baseTitle;
    }, [title, titleOverride]);
    
    var components = [];
    if (header) {
        components.push(<Header key="header"/>);
    }
    
    if (requireLogin && ! user) {
        components.push(
            <div key="page" className="page">
                <div className={"page-content" + (defaultPadding ? " defaultPadding" : "")}>
                    <p>You must be <span onClick={() => setShowLogin(true)} className="link">signed in</span> to view this page.</p>
                </div>
                <Footer key="footer"/>
            </div>
        );
    } else {
        components.push(
            <div key="page" className="page">
                <div className={"page-content" + (defaultPadding ? " defaultPadding" : "")}>
                    {children}
                </div>
                {footer ? <Footer key="footer"/> : ""}
            </div>
        );
    }
    
    return <div className="app">{components}</div>
}