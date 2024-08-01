import "../../stlyes/product-list.css"
import ProductBanner from "./ProductBanner";
import {useEffect, useState} from "react";
import {autoCatchAlert, filterProducts} from "../../util/apiRequests";
import {Divider, Spinner} from "@chakra-ui/react";

export default function ProductList({query}) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        filterProducts({...query, page: page, size: 10}).then(response => {
            setProducts(response.data.content);
        }).catch(autoCatchAlert("Failed to load dashboard items.")).finally(() => setLoading(false));
    }, [query, page]);
    
    var items = [];
    items.push(<Divider borderColor="gray"/>);
    
    if (loading) {
        items.push(<span className="ProductList-loading"><Spinner/></span>);
    }
    
    products.forEach((product, index) => {
        if (index > 0) items.push(<Divider borderColor="gray"/>);
        items.push(<ProductBanner product={product} index={index}/>);
    });
    
    if (products.length === 0) {
        items.push(<span className="ProductList-noData">No data to display.</span>);
    }
    
    return (
        <div className="ProductList">
            {items}
        </div>
    );
}