import "../../stlyes/product-list.css"
import ProductBanner, {LoadingProductBanner} from "./ProductBanner";
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
    items.push(<Divider key="ProductList-topDivider" borderColor="gray"/>);
    
    if (loading) {
        items.push(<span key="ProductList-loading" className="ProductList-loading"><Spinner/></span>);
    }
    
    products.forEach((product, index) => {
        if (index > 0) items.push(<Divider key={"ProductList-divider" + product.id} borderColor="gray"/>);
        items.push(<ProductBanner key={"ProductList-banner" + product.id} product={product} index={index}/>);
    });
    
    if (products.length === 0) {
        items.push(<span key="ProductList-noData" className="ProductList-noData">No data to display.</span>);
    }
    
    return (
        <div className="ProductList">
            {items}
        </div>
    );
}

export function LoadingProductList({size}) {
    var items = [];
    items.push(<Divider key="ProductList-topDivider" borderColor="gray"/>);
    for (let i = 0; i < size; i++) {
        if (i > 0) items.push(<Divider key={"ProductList-divider" + i} borderColor="gray"/>);
        items.push(<LoadingProductBanner key={"ProductList-banner" + i} index={i}/>);
    }

    return (
        <div className="ProductList">
            {items}
        </div>
    );
}