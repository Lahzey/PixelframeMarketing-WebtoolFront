import "../stlyes/browse.css"
import ProductList from "./components/ProductList";
import {useRecoilValue} from "recoil";
import {USER} from "../util/dataStore";
import {useState} from "react";
import {Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {IoIosSearch} from "react-icons/io";

export default function Browse() {
    const user = useRecoilValue(USER);
    const [titleFilter, setTitleFilter] = useState("");

    const type = user.role === "GAME_DEV" ? "BRAND" : (user.role === "ADVERTISER" ? "GAME" : "");
    const query = {type: type,  ownerId: "", title: titleFilter};

    return (
        <div className="Browse">
            <div className="Browse-header">
                <InputGroup className="Browse-titleFilter">
                    <InputLeftElement pointerEvents='none'>
                        <IoIosSearch/>
                    </InputLeftElement>
                    <Input type="text" placeholder="Filter" onChange={e => setTitleFilter(e.target.value)} />
                </InputGroup>
            </div>
            <ProductList query={query} />
        </div>
    );
}
