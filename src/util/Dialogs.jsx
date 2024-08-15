import "../stlyes/dialogs.css";
import {Alert, AlertIcon, Button, CloseButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack} from "@chakra-ui/react";
import {v4 as uuidv4} from 'uuid';
import {useEffect, useState} from "react";

const FADE_OUT_TIME = 500; // must match the css animation time
const BUFFER = 10; // buffer to make sure timeouts do not trigger too early

// this is a hack to allow spawning dialogs from anywhere
let alerts = [];
let modals = [];
let prevModalContent = <ModalContent></ModalContent>;
let rerender;

function removeAlert(id) {
    alerts = alerts.map(alert => alert.id === id ? {...alert, expirationTime: new Date().getTime()} : alert);
    setTimeout(rerender, BUFFER + FADE_OUT_TIME);
}

export function removeModal(id) {
    modals = modals.filter(modal => modal.id !== id);
    rerender();
}

export function DialogsRoot({children}) {
    const [, setRerender] = useState(0); // dummy number that can be set to a random number to request a rerender
    const now = new Date().getTime();

    useEffect(() => {
        rerender = () => setRerender(Math.random());
        return () => {
            rerender = null;
        }
    }, [setRerender]);

    // filter out expired alerts
    alerts = alerts.filter(alert => {
        const remainingTime = alert.expirationTime - now;
        return remainingTime > -FADE_OUT_TIME;
    });

    // create the alert elements
    const alertElements = alerts.map((alert) => 
        <Alert key={alert.id} status={alert.status} variant={alert.variant} className={"DialogsRoot-alert " + alert.status + (alert.expirationTime <= now ? " fadeOut" : "")}>
            <AlertIcon/>
            {alert.content}
            <CloseButton
                alignSelf="flex-start"
                onClick={() => removeAlert(alert.id)}
            />
        </Alert>
    );
    
    // create content of modal, which will reflect top most modal
    const modal = modals.length > 0 ? modals[modals.length - 1] : null;
    let modalContent;
    let modalClosable = true;
    if (modal) {
        modalClosable = modal.closable;
        modalContent = (
            <ModalContent>
                {
                    modal.status ?
                        <ModalHeader padding="0px">
                            <Alert status={modal.status} borderTopRadius="var(--chakra-radii-md)" paddingLeft="20px"><AlertIcon/>{modal.title}</Alert>
                        </ModalHeader>
                        :
                        <ModalHeader>
                            {modal.title}
                        </ModalHeader>
                }
                {modalClosable ? <ModalCloseButton/> : ""}
                <ModalBody>
                    {modal.content}
                </ModalBody>
                {modal.buttons.length > 0 ? 
                    <ModalFooter gap="10px" justifyContent={modal.buttons.length > 1 ? "space-between" : "end"}>
                        {modal.buttons.map((button) => {
                            return <Button colorScheme={button.colorScheme} onClick={button.onClick}>{button.text}</Button>;
                        })}
                    </ModalFooter> : ""
                }
            </ModalContent>
        );
    } else {
        modalContent = prevModalContent;
    }
    prevModalContent = modalContent;
    
    return (
        <div>
            {children}
            <div className="DialogsRoot">
                <Stack spacing={3} className="DialogsRoot-alertStack">
                    {alertElements}
                </Stack>
                <Modal isCentered isOpen={modals.length > 0} onClose={() => removeModal(modals[modals.length - 1].id)} closeOnEsc={modalClosable} closeOnOverlayClick={modalClosable}>
                    <ModalOverlay/>
                    {modalContent}
                </Modal>
            </div>
        </div>
    );
}

export function spawnAlert({title = "", content, status, variant = "subtle", durationSeconds = 5}) {
    const durationMillis = durationSeconds * 1000;
    const alert = {
        id: uuidv4(),
        title: title,
        content: content,
        status: status,
        variant: variant,
        expirationTime: new Date().getTime() + durationMillis
    }
    
    alerts.push(alert);
    rerender();
    setTimeout(rerender, durationMillis + BUFFER);
    setTimeout(rerender, durationMillis + BUFFER + FADE_OUT_TIME + BUFFER);
}

export function spawnOkModal({title, content, status = ""}) {
    const id = uuidv4();
    const modal = {
        id: id,
        title: title,
        content: content,
        buttons: [
            {
                text: "OK",
                colorScheme: "gray",
                onClick: () => removeModal(id)
            }
        ],
        status: status,
        closable: true
    }
    modals.push(modal);
    rerender();
}

export function spawnYesNoModal({title, content, onYes, yesText = "confirm", noText = "cancel"}) {
    const id = uuidv4();
    const modal = {
        id: id,
        title: title,
        content: content,
        buttons: [
            {
                text: "Cancel",
                colorScheme: "red",
                onClick: () => removeModal(id)
            },
            {
                text: "Confirm",
                colorScheme: "green",
                onClick: () => {
                    removeModal(id);
                    onYes();
                }
            }
        ],
        status: "info",
        closable: true
    }
    modals.push(modal);
    rerender();
}

export function spawnBlockingModal({title, content, modalId, status = "info"}) {
    const modal = {
        id: modalId,
        title: title,
        content: content,
        buttons: [],
        status: status,
        closable: false
    }
    modals.push(modal);
    rerender();
}