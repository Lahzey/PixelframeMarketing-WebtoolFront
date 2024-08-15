import "../stlyes/dashboard.css"
import ProductList from "./components/ProductList";
import {useRecoilValue} from "recoil";
import {USER} from "../util/dataStore";
import {Input, InputGroup, InputLeftElement, VStack} from "@chakra-ui/react";
import {IoIosAdd, IoIosSearch} from "react-icons/io";
import {Link} from "react-router-dom";
import {useState} from "react";

export default function Dashboard() {
    const user = useRecoilValue(USER);
    const [titleFilter, setTitleFilter] = useState("");
    
    const type = user.role === "GAME_DEV" ? "GAME" : (user.role === "ADVERTISER" ? "BRAND" : "");
    const urlType = user.role === "GAME_DEV" ? "games" : "brands";
    
    let productList;
    if (!type) {
        const gameQuery = {type: "GAME",  ownerId: user.id, title: titleFilter};
        const brandQuery = {type: "BRAND",  ownerId: user.id, title: titleFilter};
        productList = <VStack spacing="20px" align="stretch">
            <span>Games:</span>
            <ProductList query={gameQuery}/>
            <span>Brands:</span>
            <ProductList query={brandQuery}/>
        </VStack>
    } else {
        productList = <ProductList query={{type: type,  ownerId: user.id, title: titleFilter}}/>;
    }
    
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
            {productList}
        </div>
    );
}