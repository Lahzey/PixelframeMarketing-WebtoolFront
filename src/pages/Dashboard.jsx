import "../stlyes/dashboard.css"
import ProductList from "./components/ProductList";
import {useRecoilValue} from "recoil";
import {USER} from "../util/dataStore";
import {Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {IoIosAdd, IoIosSearch} from "react-icons/io";
import {Link} from "react-router-dom";
import {useState} from "react";

export default function Dashboard() {
    const user = useRecoilValue(USER);
    const [titleFilter, setTitleFilter] = useState("");
    
    const type = user.role === "GAME_DEV" ? "GAME" : (user.role === "ADVERTISER" ? "BRAND" : "");
    const urlType = user.role === "GAME_DEV" ? "games" : "brands";
    const query = {type: type,  ownerId: user.id, title: titleFilter};
    
    return (
        <div className="Dashboard">
            <div className="Dashboard-header">
                <InputGroup className="Dashboard-titleFilter">
                    <InputLeftElement pointerEvents='none'>
                        <IoIosSearch/>
                    </InputLeftElement>
                    <Input type="text" placeholder="Filter" onChange={e => setTitleFilter(e.target.value)} />
                </InputGroup>
                <Link to={"/" + urlType + "/new"} className="button-outline success">+ Create</Link>
            </div>
            <ProductList query={query} />
        </div>
    );
}