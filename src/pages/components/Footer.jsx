import "../../stlyes/footer.css"
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="Footer">
            <Link to="/about">About Us</Link>
            <a href="mailto: admin@pixelframemarketing.ch">Contact</a>
            <p>Copyright © 2024 Pixelframe Marketing</p>
        </footer>
    );
}