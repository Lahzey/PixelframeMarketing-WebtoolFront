import "../stlyes/profile.css";
import ProductList, {LoadingProductList} from "./components/ProductList";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {autoCatch, fetchUser, getImageUrl} from "../util/apiRequests";
import {useRecoilState} from "recoil";
import {TITLE_OVERRIDE} from "../util/dataStore";

export default function Profile(props) {
    const { id } = useParams();
    const [user, setUser] = useState({loading: true});
    const [, setTitleOverride] = useRecoilState(TITLE_OVERRIDE);

    useEffect(() => {
        fetchUser(id).then(response => {
            setTimeout(() => setUser(response.data), 2000);
        }).catch(autoCatch(null, (message) => setUser({errorMessage: message})));
    }, [id]);

    useEffect(() => {
        setTitleOverride(user && user.username ? user.username : "Profile");
        return () => setTitleOverride(null);
    }, [user, setTitleOverride]);
    
    if (user.loading) {
        return (
            <div className="Profile">
                <div className="Profile-userInfo loadingAnimation">
                    <div className="Profile-userImage loadingPlaceholder"/>
                    <span className="Profile-userName loadingPlaceholder">{" "}</span>
                </div>
                <div className="Profile-productListings">
                    <span className="Profile-productListingsTitle loadingPlaceholder loadingAnimation">{" "}</span>
                    <LoadingProductList size={3}/>
                </div>
            </div>
        );
    }
    
    if (user.errorMessage) {
        return (
          <p>Failed to load profile.<br/><br/>Reason:<br/>{user.errorMessage}</p>  
        );
    }

    return (
        <div className="Profile">
            <div className="Profile-userInfo">
                <img className="Profile-userImage" src={getImageUrl(user.imageId)} alt="Profile Picture"/>
                <span className="Profile-userName">{user.username}</span>
            </div>
            <div className="Profile-productListings">
                <span className="Profile-productListingsTitle">{user.username}'s Listings:</span>
                <ProductList query={{type: user.role === "GAME_DEV" ? "GAME" : (user.role === "ADVERTISER" ? "BRAND" : ""), ownerId: id, title: ""}}/>
            </div>
        </div>
    );
}