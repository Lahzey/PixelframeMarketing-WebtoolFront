import "../../stlyes/product-banner.css"
import {useRecoilValue} from "recoil";
import {useAllTags, USER} from "../../util/dataStore";
import {Link} from "react-router-dom";
import {getImageUrl} from "../../util/apiRequests";

export default function ProductBanner({product, index = 0, imageOverride = null}) {
    const user = useRecoilValue(USER);
    const allTags = useAllTags();
    
    const isOwned = user ? product.ownerId === user.id : false;
    const urlType = product.type === "GAME" ? "games" : "brands";
    
    var tagSpans = product.tags.map((tagName) => {
        const tag = allTags.find(tag => tag.name === tagName);
        return <span className="ProductBanner-tag" style={{backgroundColor: tag?.categoryColor??"#111"}}>{tagName}</span>
    });

    return (
        <Link to={"/" + urlType + "/" + product.id} className={"ProductBanner " + (index % 2 ? "list-item-bg-dark" : "list-item-bg-light")}>
            <div className="ProductBanner-content">
                <div className="ProductBanner-contentLeft">
                    <h2 className="ProductBanner-title">{product.title}</h2>
                    <div className="ProductBanner-metaData">
                        {tagSpans}
                        <span className="ProductBanner-ageRestriction">
                            {product.ageRestriction ?? "no age restriction"}
                          </span>
                    </div>
                    <p className="ProductBanner-description">
                        {product.description}
                    </p>
                </div>
                <img className="ProductBanner-contentRight" src={imageOverride ? URL.createObjectURL(imageOverride) : getImageUrl(product.thumbnailId)}/>
            </div>
            {isOwned ?
                <div className="ProductBanner-buttonPanel">
                    <span className="button primary">Edit</span>
                    <span className="button secondary">Private/Public</span>
                    <span className="button error">Delete</span>
                </div> : ""
            }
        </Link>
    );
}