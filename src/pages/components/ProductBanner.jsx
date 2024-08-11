import "../../stlyes/product-banner.css"
import {useRecoilValue} from "recoil";
import {useAllTags, USER} from "../../util/dataStore";
import {Link} from "react-router-dom";
import {getImageUrl} from "../../util/apiRequests";
import Rand from "rand-seed";

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
                    <span className="ProductBanner-title">{product.title}</span>
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

export function LoadingProductBanner({index = 0}) {
    const random = new Rand((index * 987) + "");
    const randomInt = (max) => {
        return Math.floor(random.next() * max);
    }
    
    return (
        <div className={"ProductBanner " + (index % 2 ? "list-item-bg-dark" : "list-item-bg-light")}>
            <div className="ProductBanner-content loadingAnimation">
                <div className="ProductBanner-contentLeft">
                    <span className="ProductBanner-title loadingPlaceholder" style={{alignSelf: "start"}}>{" ".repeat(20 + randomInt(30))}</span>
                    <div className="ProductBanner-metaData">
                        <span className="ProductBanner-tag loadingPlaceholder">{" ".repeat(5 + randomInt(10))}</span>
                        <span className="ProductBanner-tag loadingPlaceholder">{" ".repeat(5 + randomInt(10))}</span>
                        <span className="ProductBanner-tag loadingPlaceholder">{" ".repeat(5 + randomInt(10))}</span>
                        <span className="ProductBanner-ageRestriction loadingPlaceholder">{" ".repeat(15 + randomInt(35))}</span>
                    </div>
                    <p className="ProductBanner-description">
                        <span className="loadingPlaceholder">{" ".repeat(10 + randomInt(150))}</span><br/>
                        <span className="loadingPlaceholder">{" ".repeat(10 + randomInt(150))}</span><br/>
                        <span className="loadingPlaceholder">{" ".repeat(10 + randomInt(150))}</span><br/>
                        <span className="loadingPlaceholder">{" ".repeat(10 + randomInt(150))}</span><br/>
                    </p>
                </div>
                <span className="ProductBanner-contentRight loadingPlaceholder" style={{width: 100, height: 150}}/>
            </div>
        </div>
    );
}