import Header from "./Header";
import Footer from "./Footer";

export default function Page({children, header, footer}) {
    var components = [];
    if (header) {
        components.push(<Header key="header"/>);
    }
    
    components.push(
        <div key="content" className="page-content">
            {children}
        </div>
    );
    
    if (footer) {
        components.push(<Footer key="footer"/>);
    }
    
    return <div className="app">{components}</div>
}