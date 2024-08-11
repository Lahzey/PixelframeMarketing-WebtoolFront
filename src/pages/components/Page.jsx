import Header from "./Header";
import Footer from "./Footer";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {TITLE_OVERRIDE} from "../../util/dataStore";

export default function Page({children, title, header, footer, defaultPadding = true}) {
    const titleOverride = useRecoilValue(TITLE_OVERRIDE);
    
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
    
    components.push(
        <div key="page" className="page">
            <div className={"page-content" + (defaultPadding ? " defaultPadding" : "")}>
                {children}
            </div>
            {footer ? <Footer key="footer"/> : ""}
        </div>
    );
    
    return <div className="app">{components}</div>
}