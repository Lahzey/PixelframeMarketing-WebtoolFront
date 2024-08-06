import Header from "./Header";
import Footer from "./Footer";

export default function Page({children, header, footer, defaultPadding = true}) {
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