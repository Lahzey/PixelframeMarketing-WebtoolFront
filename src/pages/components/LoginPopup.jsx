import "../../stlyes/login-popup.css"
import React, {useState} from 'react';
import {autoCatchAlert, autoCatchModal, fetchUser, getUserIdFromToken, loginUser, registerUser, updateUser, uploadImage} from "../../util/apiRequests";
import {useRecoilState} from "recoil";
import {USER} from "../../util/dataStore";
import {Checkbox, FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";
import Select from "react-select";

export default function LoginPopup({close, showRegister, registerRole}) {
    const [user, setUser] = useRecoilState(USER);
    const [registerMode, setRegisterMode] = useState(!!showRegister);
    
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState(registerRole ?? '');
    const [image, setImage] = useState(null)
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [remember, setRemember] = useState(true);
    const [inputErrors, setInputErrors] = useState({});

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setInputErrors({});
        
        let newInputErrors = new Map();

        const user = {
            email: email,
            password: password,
            username: username,
            role: role
        }
        
        let hasErrors = false;
        
        const setError = (field, error) => {
            newInputErrors[field] = error;
            hasErrors = true;
        }
        
        if (registerMode) {
            if (password !== confirmPassword) setError("confirmPassword", "Must match password");
            if (!username) setError("username", "Username cannot be empty");
            if (!role) setError("role", "Account Type must be selected");
        }
        
        if (hasErrors) {
            setInputErrors(newInputErrors);
            return;
        }
        
        const login = (after = null) => {
            return loginUser(user).then(response => {
                const storage = remember ? localStorage : sessionStorage;
                const token = response.data;
                storage.setItem("token", token);
                
                fetchUser(getUserIdFromToken(token)).then((response) => {
                    setUser(response.data);
                    if (after) after(response.data);
                    close();
                }).catch(autoCatchAlert());
            }).catch(autoCatchModal("Failed to log in.", errors => setInputErrors(errors)));
        }

        const registerWithImage = () => {
            registerUser(user).then(registerResponse => {
                login((user) => {
                    uploadImage(image).then((uploadResponse) => {
                        updateUser({...user,  imageId: uploadResponse.data.id}).then(updateResponse => {
                            setUser(updateResponse.data);
                        }).catch(autoCatchModal("Failed to update user with new image.\nYour account has still been created, please try updating your profile picture at a later time."))
                    }).catch(autoCatchModal("Image upload failed.\nYour account has still been created, please try updating your profile picture at a later time."));
                });
            }).catch(autoCatchModal("User registration failed.", errors => setInputErrors(errors)));
        }
        
        const register = () => {
            registerUser(user).then(response => {
                login();
            }).catch(autoCatchModal("User registration failed.", errors => setInputErrors(errors)));
        }
        
        if (registerMode && image) {
            registerWithImage();
        } else if (registerMode) {
            register();
        } else {
            login();
        }
    }
    
    const roleOptions = [{ value: "GAME_DEV", label: "Game Developer" }, { value: "ADVERTISER", label: "Advertiser" }];
    const chosenRoleOption = roleOptions.find(option => option.value === role);

    return (
        <div className="LoginPopup modal">
            <form className="LoginPopup-form" onSubmit={handleSubmit}>
                <div className="LoginPopup-inputContainer">
                    {generateInputField(email, setEmail, "email", "email", inputErrors)}
                    {registerMode ? generateInputField(username, setUsername, "username", "text", inputErrors) : ""}
                    {generateInputField(password, setPassword, "password", "password", inputErrors)}
                    {registerMode ? generateInputField(confirmPassword, setConfirmPassword, "confirmPassword", "password", inputErrors) : ""}
                    
                    {registerMode ? [
                        <label htmlFor={"role"}><b>Select your account type</b></label>,
                        <Select name="role" value={chosenRoleOption} options={roleOptions} onChange={(selection) => setRole(selection.value)}/>
                    ] : ""}
                    
                    {registerMode ? [
                        <FormControl isInvalid={inputErrors["image"] !== undefined}>
                            <FormLabel>Upload your profile picture</FormLabel>
                            <Input
                                type={"file"}
                                accept={".jpg,.jpeg,.png,.gif,.svg"}
                                name={"image"}
                                onChange={onImageChange}
                                backgroundColor="white"
                            />
                            <FormErrorMessage>{inputErrors["image"]}</FormErrorMessage>
                        </FormControl>,
                        image ? <img src={URL.createObjectURL(image)} className="LoginPopup-previewImage" alt="Your upload"/> :
                            <img src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" className="LoginPopup-previewImage" alt="Default if no upload is done"/>
                    ] : ""}

                    <button type="submit" className="LoginPopup-loginButton button success">{registerMode ? "Register" : "Login"}</button>
                    <div className="LoginPopup-belowLogin">
                        {registerMode ?
                            <div></div>/* filler for flex layout */ :
                            <Checkbox checked={remember} sx={{'& .chakra-checkbox__control': {borderColor: 'gray.500'}}} onChange={e => setRemember(e.target.checked)}>Remember me</Checkbox>
                        }
                        <span className="LoginPopup-registerMessage">
                            {registerMode ? "Already" : "Don't"} have an account? <b onClick={() => setRegisterMode(!registerMode)} className="LoginPopup-functionLink">{registerMode ? "Log In" : "Register now"}</b>
                        </span>
                    </div>
                </div>

                <div className="LoginPopup-footer">
                    <button type="button" onClick={close} className="LoginPopup-cancelButton button error">Cancel</button>
                    <span className="LoginPopup-functionLink"><b>Forgot password?</b></span>
                </div>
            </form>
        </div>
    );
}

function generateInputField(value, setValue, name, inputType, inputErrors) {
    const capitalizedName = camelCaseToReadable(name);
    return <FormControl isInvalid={inputErrors[name] !== undefined}>
        <FormLabel>{capitalizedName}</FormLabel>
        <Input
            type={inputType}
            placeholder={capitalizedName}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            backgroundColor="white"
        />
        <FormErrorMessage>{inputErrors[name]}</FormErrorMessage>
    </FormControl>
}

function camelCaseToReadable(str) {
    // Capitalize the first letter of the string
    str = str.charAt(0).toUpperCase() + str.slice(1);

    // Insert a space before each uppercase letter (except the first one)
    str = str.replace(/([A-Z])/g, ' $1').trim();

    return str;
}