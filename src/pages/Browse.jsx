import "../stlyes/browse.css"
import ProductList from "./components/ProductList";
import {useRecoilValue} from "recoil";
import {USER} from "../util/dataStore";
import {useState} from "react";
import {Input, InputGroup, InputLeftElement, VStack} from "@chakra-ui/react";
import {IoIosSearch} from "react-icons/io";

export default function Browse() {
    const user = useRecoilValue(USER);
    const [titleFilter, setTitleFilter] = useState("");

    const type = user.role === "GAME_DEV" ? "BRAND" : (user.role === "ADVERTISER" ? "GAME" : "");

    let productList;
    if (!type) {
        const gameQuery = {type: "GAME",  ownerId: "", title: titleFilter};
        const brandQuery = {type: "BRAND",  ownerId: "", title: titleFilter};
        productList = <VStack spacing="20px" align="stretch">
            <span>Games:</span>
            <ProductList query={gameQuery}/>
            <span>Brands:</span>
            <ProductList query={brandQuery}/>
        </VStack>
    } else {
        productList = <ProductList query={{type: type,  ownerId: "", title: titleFilter}}/>;
    }

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
            {productList}
        </div>
    );
}
