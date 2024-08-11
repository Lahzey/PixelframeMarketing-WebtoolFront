import "../stlyes/product.css"
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import ProductBanner from "./components/ProductBanner";
import {LabelCollapse} from "./components/Collapse";
import Select from "react-select";
import {TITLE_OVERRIDE, useAllTags, USER} from "../util/dataStore";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {FormControl, FormErrorMessage, FormLabel, Input, Textarea} from "@chakra-ui/react";
import {autoCatch, autoCatchModal, createProduct, fetchProduct, getImageUrl, updateProduct, uploadImage} from "../util/apiRequests";
import {useRecoilState, useRecoilValue} from "recoil";
import {spawnAlert, spawnYesNoModal} from "../util/Dialogs";
import PageEditor from "./components/PageEditor";
import {ProductRevenueChart} from "./components/ProductRevenueChart";

export default function Product({type = "GAME"}) {
    const { id } = useParams();
    const user = useRecoilValue(USER);
    const [product, setProduct] = useState(null);
    const [originalProduct, setOriginalProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [, setTitleOverride] = useRecoilState(TITLE_OVERRIDE);

    useEffect(() => {
        if (id === "new") {
            const emptyProduct = createEmptyProduct(type, user.id);
            setProduct(emptyProduct);
            setOriginalProduct(emptyProduct);
            setLoading(false);
            setError(null);
        } else {
            createProductFetch(id, setProduct, setOriginalProduct, setLoading, setError);
        }
    }, [id, type, user.id]);

    useEffect(() => {
        if (originalProduct) {
            setTitleOverride(id === "new" ? "Create listing" : originalProduct.title);
        } else {
            setTitleOverride("Listing " + id);
        }
        return () => setTitleOverride(null);
    }, [id, originalProduct, setTitleOverride]);
    
    if (loading) return <div className="Product">Loading...</div>
    if (error) return <div className="Product">{error}</div>
    else return <ProductContent product={product} setProduct={setProduct} originalProduct={originalProduct} setOriginalProduct={setOriginalProduct} isOwner={product.ownerId === user.id}/>
}

function ProductContent({product, setProduct, originalProduct, setOriginalProduct, isOwner}) {
    const [currentTab, setCurrentTab] = useState(product.id ? "overview" : "edit");
    const [inputErrors, setInputErrors] = useState({});
    const navigate = useNavigate();

    let content;
    switch (currentTab) {
        case "edit":
            content = <ProductEdit product={product} setProduct={setProduct} inputErrors={inputErrors}/>
            break;
        case "preview":
            content = <ProductPreview product={product}/>
            break;
        default:
            content = <ProductOverview product={product}/>
            break;
    }
    
    const discardChanges = () => {
        spawnYesNoModal({title: "Discard changes", content: "Are you sure you wish to discard all changes you made?", onYes: () => {
            setProduct(originalProduct);
        }});
    }

    if (isOwner) {
        return (
            <div className="Product owned">
                <div className="Product-tabContainer">
                    <div className={"Product-tab" + (product.id ? (currentTab === "overview" ? " active" : "") : " disabled")} onClick={() => {if (product.id) setCurrentTab("overview")}}>Overview</div>
                    <div className={"Product-tab" + (currentTab === "edit" ? " active" : "")} onClick={() => setCurrentTab("edit")}>Edit</div>
                    <div className={"Product-tab" + (currentTab === "preview" ? " active" : "")} onClick={() => setCurrentTab("preview")}>Preview</div>
                </div>
                {content}
                <div className="Product-editButtonContainer" hidden={!product.hasChanges}>
                    <span className="button error" onClick={discardChanges}>Discard changes</span>
                    <span className="button success" onClick={() => submitProduct(product, setProduct, setOriginalProduct, setInputErrors, navigate)}>Save changes</span>
                </div>
            </div>
        );
    } else {
        return (
            <div className="Product">
                <ProductPage product={product}/>
            </div>
        );
    }
}

function ProductOverview({product}) {
    let revenue = 0;
    product.monthlyRevenue.forEach(timedValue => revenue += timedValue.value);
    const revenueLabel = revenue > 0 ? "Revenue" : revenue < 0 ? "Cost" : "Revenue/Cost";
    const revenueStyle = {color: revenue > 0 ? "var(--success)" : "var(--info)"};
    if (revenue < 0) revenue *= -1;

    return (
        <div className="ProductOverview">
            <div className="ProductOverview-head">
                <div className="ProductOverview-headLeft">
                    <span className="ProductOverview-title"><b>{product.title}</b></span>
                    <div className="ProductOverview-stats">
                        <span className="ProductOverview-statLabel">Views:</span>
                        <span className="ProductOverview-statValue">{product.views.toLocaleString()}</span>
                        <span className="ProductOverview-statLabel">{revenueLabel}:</span>
                        <span className="ProductOverview-statValue" style={revenueStyle}>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(revenue)}</span>
                    </div>
                    <ProductRevenueChart product={product}/>
                    <Link to={(product.type === "GAME" ? "/game/" : "/brand/") + product.id + "/contracts"} className="ProductOverview-contractsLink"><span className="button-outline info">Contracts [{product.contracts.length}]</span></Link>
                </div>
                <div className="ProductOverview-headRight">
                    <img
                        src={product.thumbnailUpload ? URL.createObjectURL(product.thumbnailUpload) : getImageUrl(product.thumbnailId)}
                        className="ProductOverview-image"
                        alt="Thumbnail image"
                    />
                </div>
            </div>
        </div>
    );
}

function ProductEdit({product, setProduct, inputErrors}) {
    const tagOptions = useAllTags().map(tag => { return {value: tag.name, label: tag.name, color: tag.categoryColor}; });
    
    const getOptionsFromValues = (values) => {
        return values.map(value => tagOptions.find(option => option.value === value));
    };

    const getValuesFromOptions = (options) => {
        return options.map(option => option.value);
    };
    
    const updateProduct = (newProps) => {
        setProduct({
            ...product,
            ...newProps,
            hasChanges: true
        });
    };
    
    const isPublic = product.visibility === "PUBLIC";

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: state.data?.color ?? "#fff",
        }),
        multiValue: (provided, state) => ({
            ...provided,
            backgroundColor: state.data?.color ?? "#fff",
        }),
        multiValueLabel: (provided, state) => ({
            ...provided,
            color: 'white',
        }),
        multiValueRemove: (provided, state) => ({
            ...provided,
            color: 'white',
            ':hover': {
                backgroundColor: state.data?.color ?? "#fff",
                color: 'black',
            },
        }),
    };

    return (
        <div className="ProductEdit">
            <form className="ProductEdit-form">
                <div className="ProductEdit-visibilityToggle">
                    <span className="button light" onClick={() => updateProduct({visibility: isPublic ? "PRIVATE" : "PUBLIC"})}>
                        {isPublic ? <IoMdEye/> : <IoMdEyeOff/>}{isPublic ? "Public" : "Private"}
                    </span>
                </div>

                <div className="ProductEdit-split">
                    <div className="ProductEdit-left">
                        <FormControl isInvalid={inputErrors["title"] !== undefined}>
                            <FormLabel className="ProductEdit-label">Title *</FormLabel>
                            <Input type="text" placeholder="Title" value={product.title} backgroundColor="white" onChange={(e) => {
                                updateProduct({title: e.target.value});
                            }}/>
                            <FormErrorMessage>{inputErrors["title"]}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={inputErrors["tags"] !== undefined}>
                            <FormLabel className="ProductEdit-label">Tags</FormLabel>
                            <Select placeholder="Select tags..." isMulti options={tagOptions} value={getOptionsFromValues(product.tags)} closeMenuOnSelect={false} styles={customStyles} onChange={(selectedOptions) => {
                                updateProduct({tags: getValuesFromOptions(selectedOptions)});
                            }}/>
                            <FormErrorMessage>{inputErrors["tags"]}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={inputErrors["ageRestriction"] !== undefined}>
                            <FormLabel className="ProductEdit-label">Age Restriction</FormLabel>
                            <Input type="text" placeholder="Age Restriction" value={product.ageRestriction} backgroundColor="white" onChange={(e) => {
                                updateProduct({ageRestriction: e.target.value});
                            }}/>
                            <FormErrorMessage>{inputErrors["ageRestriction"]}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={inputErrors["description"] !== undefined}>
                            <FormLabel className="ProductEdit-label">Description *</FormLabel>
                            <Textarea placeholder="Description" value={product.description} rows={3} maxLength={400} backgroundColor="white" onChange={(e) => {
                                updateProduct({description: e.target.value});
                            }}/>
                            <FormErrorMessage>{inputErrors["description"]}</FormErrorMessage>
                        </FormControl>
                    </div>

                    <div className="ProductEdit-right">
                        <FormControl isInvalid={inputErrors["thumbnailUpload"] !== undefined}>
                            <FormLabel className="ProductEdit-label">Thumbnail picture (shown in banner)</FormLabel>
                            <Input
                                type={"file"}
                                accept={".jpg,.jpeg,.png,.gif,.svg"}
                                name={"image"}
                                onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        updateProduct({thumbnailUpload: e.target.files[0]});
                                    }
                                }}
                            />
                            <FormErrorMessage>{inputErrors["thumbnailUpload"]}</FormErrorMessage>
                        </FormControl>
                        <img className="ProductEdit-previewImage"
                            src={product.thumbnailUpload ? URL.createObjectURL(product.thumbnailUpload) : getImageUrl(product.thumbnailId)}
                            alt={product.thumbnailUpload ? "Your upload" : "Default thumbnail image"}
                        />
                    </div>
                </div>

                <FormControl isInvalid={inputErrors["pageContent"] !== undefined}>
                    <FormLabel className="ProductEdit-label">Page Content *</FormLabel>
                    <FormErrorMessage>{inputErrors["pageContent"]}</FormErrorMessage>
                    <PageEditor product={product} updateProduct={updateProduct}/>
                </FormControl>
            </form>
        </div>
);
}

function ProductPreview({product}) {
    return (
        <div className="ProductPreview">
            <LabelCollapse labelClassName="ProductPreview-title" label="Banner shown in search">
                <div className="ProductPreview-content">
                    <ProductBanner product={product} imageOverride={product.thumbnailUpload??null}/>
                </div>
            </LabelCollapse>
            <LabelCollapse labelClassName="ProductPreview-title" label="Product Page">
                <div className="ProductPreview-content">
                    <ProductPage product={product}/>
                </div>
            </LabelCollapse>
        </div>
    );
}

function ProductPage({product}) {
    return (
        <div className="ProductPage">
            <span className="ProductPage-title">{product.title}</span>
            <div className="ProductPage-content" dangerouslySetInnerHTML={{__html: product.pageContent}}/>
        </div>
    );
}

function createEmptyProduct(type, userId) {
    return {
        type: type,
        id: "",
        title: "",
        ownerId: userId,
        visibility: "PRIVATE",
        tags: [],
        ageRestriction: null,
        thumbnailId: "no_image",
        thumbnailUpload: null,
        description: "",
        views: 0,
        monthlyRevenue: [],
        contracts: [],
        pageContent: "<span>This is the page of your game. Here you describe in more detail what it is about and possibly also how you imagine product placements in your game. You may use images <img src='https://upload.wikimedia.org/wikipedia/commons/b/b4/Blue_eye_icon.png' width=32 height=32/> or <b>decorate</b> your <i>text</i> using <code>HTML</code>.</span>",
        hasChanges: false
    }
}

function createProductFetch(id, setProduct, setOriginalProduct, setLoading, setError) {
    setError(null);
    setLoading(true);
    fetchProduct(id).then(response => {
        setLoading(false);
        setProduct(response.data);
        setOriginalProduct(response.data);
    }).catch(autoCatch(null,  (errorMessage) => {
        setLoading(false);
        setError(<p><b>Failed to load product.</b><br/>Reason:<br/>{errorMessage}</p>);
    }));
}

function submitProduct(product, setProduct, setOriginalProduct, setInputErrors, navigate, confirmed = false) {
    if (!confirmed) {
        const isPublic = product.visibility === "PUBLIC";
        const message = 
            <p>
                Are you sure you want to save your changes?<br/>
                Your product is <b>{product.visibility}</b> and will therefore{isPublic ? "" : " not"} be considered for matching.
            </p>
        spawnYesNoModal({title: "Confirm Save", content: message, onYes: () => {
            submitProduct(product, setProduct, setOriginalProduct, setInputErrors, navigate, true);
        }});
        return;
    }
    setInputErrors({});
    
    // handle image upload
    if (product.thumbnailUpload) {
        uploadImage(product.thumbnailUpload).then(response => {
            const newProduct = {
                ...product,
                thumbnailId: response.data.id,
                thumbnailUpload: null
            }
            setProduct(newProduct);
            submitProduct(newProduct, setProduct, setOriginalProduct, setInputErrors, navigate, true);
        }).catch(autoCatchModal("Failed to upload thumbnail image", (validationErrors) => {
            setInputErrors(validationErrors);
        }));
        return;
    }
    
    const productToSubmit = {
        type: product.type,
        id: product.id,
        ownerId: product.ownerId,
        title: product.title,
        visibility: product.visibility,
        tags: product.tags,
        ageRestriction: product.ageRestriction,
        thumbnailId: product.thumbnailId,
        description: product.description,
        pageContent: product.pageContent,
    }
    const promise = product.id ? updateProduct(productToSubmit) : createProduct(productToSubmit);
    promise.then(response => {
        const product = response.data;
        setProduct(product);
        setOriginalProduct(product);
        navigate((product.type === "GAME" ? "/games/" : "/brands/") + product.id);
        spawnAlert({content: "Changes saved successfully", status: "success"});
    }).catch(autoCatchModal("Failed to " + (product.id ? "update" : "create") + " product", (validationErrors) => {
        setInputErrors(validationErrors);
    }));
}