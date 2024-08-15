import {autoCatch, uploadImage} from "./apiRequests";
import {removeModal, spawnBlockingModal} from "./Dialogs";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {Button, CircularProgress, VStack} from "@chakra-ui/react";
import {FaCheckCircle} from "react-icons/fa";
import {MdError} from "react-icons/md";


export function uploadObjectWithImage(object, imageProp, imageIdProp, title, imageUploadMessage, objectUploadMessage, uploadFunction) {
    return new Promise((resolve, reject) => {
        if ((!object[imageProp]) && object[imageIdProp]) {
            uploadFunction(object).then(response => resolve(response)).catch(error => reject(error));
            return;
        }

        const modalId = uuidv4();
        const uploader = <Uploader
            modalId={modalId}
            object={object}
            imageProp={imageProp}
            imageIdProp={imageIdProp}
            imageUploadMessage={imageUploadMessage}
            objectUploadMessage={objectUploadMessage}
            uploadFunction={uploadFunction}
            resolve={resolve}
            reject={reject}
        />
        spawnBlockingModal({title: title, content: uploader, modalId: modalId});
    });
}

function Uploader({modalId, object, imageProp, imageIdProp, imageUploadMessage, objectUploadMessage, uploadFunction, resolve, reject}) {
    const [imageProgress, setImageProgress] = useState(0);
    const [imageDone, setImageDone] = useState(false);
    const [imageError, setImageError] = useState(null);
    const [objectDone, setObjectDone] = useState(false);
    const [objectError, setObjectError] = useState(null);

    useEffect(() => {
        uploadImage(object[imageProp], (progressEvent) => {
            setImageProgress(progressEvent.loaded / progressEvent.total);
        }).then(response => {
            setImageDone(true);
            object[imageIdProp] = response.data.id;
            object[imageProp] = null;
            uploadFunction(object).then(response => {
                setObjectDone(true);
                resolve(response);
            }).catch(error => {
                reject(error);
                autoCatch(null, (message) => setObjectError(message))(error);
            });
        }).catch(error => {
            reject(error);
            autoCatch(null, (message) => setImageError(message))(error);
        })
    }, [imageIdProp, imageProp, object, reject, resolve, uploadFunction]);
    
    const objectStarted = imageDone || imageError;
    const imageProgressIcon = imageDone ? <FaCheckCircle color="#28a745"/> : (imageError ? <MdError color="#dc3545"/> : <CircularProgress value={imageProgress * 360} size="20px"/>);
    const objectProgressIcon = objectDone ? <FaCheckCircle color="#28a745"/> : (objectError ? <MdError color="#dc3545"/> : <CircularProgress isIndeterminate size="20px"/>);
    
    return (
        <VStack spacing="20px" align="stretch">
            <span style={{color: "#000000", display: "flex", gap: "10px", alignItems: "center"}}>
                {imageProgressIcon} {imageError ?? imageUploadMessage}
            </span>
            <span style={{color: (objectStarted ? "#000000" : "#bfbfbf"), display: "flex", gap: "10px", alignItems: "center"}}>
                {objectStarted ? objectProgressIcon : "   "} {objectError ?? objectUploadMessage}
            </span>
            <Button colorScheme="gray" isLoading={!(imageError || objectError || objectDone)} onClick={() => removeModal(modalId)}>Close</Button>
        </VStack>
    );
}