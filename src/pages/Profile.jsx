import "../stlyes/profile.css";
import ProductList, {LoadingProductList} from "./components/ProductList";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {autoCatch, autoCatchAlert, autoCatchModal, fetchUser, getImageUrl, updateUser, uploadImage} from "../util/apiRequests";
import {useRecoilState} from "recoil";
import {TITLE_OVERRIDE, USER} from "../util/dataStore";
import {Button, FormControl, FormErrorMessage, FormLabel, HStack, Input} from "@chakra-ui/react";
import {BsPencilFill} from "react-icons/bs";
import {MdDelete} from "react-icons/md";
import {BiSolidSave} from "react-icons/bi";
import {spawnAlert, spawnYesNoModal} from "../util/Dialogs";
import {uploadObjectWithImage} from "../util/Uploader";

export default function Profile(props) {
    const { id } = useParams();
    const [user, setUser] = useState({loading: true});
    const [currentUser, setCurrentUser] = useRecoilState(USER);
    const [, setTitleOverride] = useRecoilState(TITLE_OVERRIDE);
    const [editMode, setEditMode] = useState(false);
    const isOwner = currentUser && currentUser.id === id;

    useEffect(() => {
        fetchUser(id).then(response => {
            setUser(response.data);
        }).catch(autoCatch(null, (message) => setUser({errorMessage: message})));
    }, [id]);

    useEffect(() => {
        setTitleOverride(user && user.username ? user.username : "Profile");
        return () => setTitleOverride(null);
    }, [user, setTitleOverride]);
    
    if (user.loading) {
        return (
            <div className="Profile">
                <div className="Profile-left loadingAnimation">
                    <div className="Profile-userImage loadingPlaceholder"/>
                    <span className="Profile-userName loadingPlaceholder">{" "}</span>
                </div>
                <div className="Profile-right">
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
    
    if (isOwner && editMode) {
        return <ProfileEdit user={user} setUser={setUser} setCurrentUser={setCurrentUser} setEditMode={setEditMode}/>
    }

    return (
        <div className="Profile">
            <div className="Profile-left">
                <img className="Profile-userImage" src={getImageUrl(user.imageId)} alt="Profile Picture"/>
                <span className="Profile-userName">{user.username}</span>
                {isOwner ? <Button leftIcon={<BsPencilFill/>} colorScheme="yellow" variant="outline" onClick={() => setEditMode(true)}>Edit</Button> : ""}
            </div>
            <div className="Profile-right">
                <span className="Profile-productListingsTitle">{user.username}'s Listings:</span>
                <ProductList query={{type: user.role === "GAME_DEV" ? "GAME" : (user.role === "ADVERTISER" ? "BRAND" : ""), ownerId: id, title: ""}}/>
            </div>
        </div>
    );
}

function ProfileEdit({user, setUser, setCurrentUser, setEditMode}) {
    const [inputErrors, setInputErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const updateProfile = (newProps) => {
        setUser({...user, ...newProps, hasChanges: true});
    }
    
    const discard = () => {
        spawnYesNoModal({title: "Confirm discard", content: "Are you sure you wish to discard your changes?", onYes: () => {
            setLoading(true);
            fetchUser(user.id).then(response => {
                setUser(response.data);
                setEditMode(false);
            }).catch(autoCatchAlert("Failed to re-fetch user")).finally(() => {
                setLoading(false);
            });
        }});
    }
    
    const save = () => {
        setInputErrors({});
        setLoading(true);
        uploadObjectWithImage(
            user, 
            "imageUpload", 
            "imageId", 
            "Updating Profile", 
            "Upload profile picture", 
            "Save profile", 
            (toUpload) => updateUser(toUpload)
        ).then(response => {
            setUser(response.data);
            setCurrentUser(response.data);
            spawnAlert({content: "Profile updated", status: "success"});
            setEditMode(false);
        }).catch(autoCatchModal("Failed to save changes", (validationErrors) => {
            setInputErrors(validationErrors);
        })).finally(() => {
            setLoading(false);
        });
    }
    
    return (
      <div className="Profile">
          <div className="Profile-left">
              <img className="Profile-userImage" src={user.imageUpload ? URL.createObjectURL(user.imageUpload) : getImageUrl(user.imageId)} alt="Profile Picture"/>
              <FormControl isInvalid={inputErrors["image"] !== undefined}>
                  <FormLabel className="ProductEdit-label">Thumbnail picture (shown in banner)</FormLabel>
                  <Input
                      type={"file"}
                      accept={".jpg,.jpeg,.png,.gif,.svg"}
                      name={"image"}
                      onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                              updateProfile({imageUpload: e.target.files[0]});
                          }
                      }}
                  />
                  <FormErrorMessage>{inputErrors["image"]}</FormErrorMessage>
              </FormControl>
              <HStack justify="space-between">
                  <Button leftIcon={<MdDelete/>} isLoading={loading} colorScheme="red" onClick={discard}>Discard</Button>
                  <Button leftIcon={<BiSolidSave/>} isLoading={loading} colorScheme="green" onClick={save}>Save</Button>
              </HStack>
          </div>
          <div className="Profile-right">
              <FormControl isInvalid={inputErrors["username"] !== undefined}>
                  <FormLabel className="ProductEdit-label">Username</FormLabel>
                  <Input type="text" placeholder="Username" value={user.username} backgroundColor="white" onChange={(e) => {
                      updateProfile({username: e.target.value});
                  }}/>
                  <FormErrorMessage>{inputErrors["username"]}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={inputErrors["email"] !== undefined}>
                  <FormLabel className="ProductEdit-label">Email</FormLabel>
                  <Input type="email" placeholder="Email" value={user.email} backgroundColor="white" onChange={(e) => {
                      updateProfile({email: e.target.value});
                  }}/>
                  <FormErrorMessage>{inputErrors["email"]}</FormErrorMessage>
              </FormControl>
              <span>For password resets please contact the administrator.</span>
          </div>
      </div>
    );
}