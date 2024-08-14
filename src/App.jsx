import "./stlyes/global.css";
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import Page from "./pages/components/Page";
import {RecoilRoot} from "recoil";
import Product from "./pages/Product";
import {ChakraProvider} from "@chakra-ui/react";
import {DialogsRoot} from "./util/Dialogs";
import About from "./pages/About";
import Profile from "./pages/Profile";
import LoginPopup from "./pages/components/LoginPopup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Page footer defaultPadding={false}><Home/></Page>,
    },
    {
        path: "/dashboard",
        element: <Page title="Dashboard" header footer requireLogin><Dashboard/></Page>,
    },
    {
        path: "/browse",
        element: <Page title="Browse" header footer requireLogin><Browse/></Page>,
    },
    {
        path: "/games/:id",
        element: <Page header footer requireLogin><Product type="GAME"/></Page>,
    },
    {
        path: "/brands/:id",
        element: <Page header footer requireLogin><Product type="BRAND"/></Page>,
    },
    {
        path: "/profile/:id",
        element: <Page header footer requireLogin><Profile/></Page>,
    },
    {
        path: "/about",
        element: <Page title="About Us" header footer><About/></Page>,
    },
]);

export default function App() {
    return (
        <RecoilRoot>
            <ChakraProvider>
                <DialogsRoot>
                    <RouterProvider router={router}/>
                    <LoginPopup/>
                </DialogsRoot>
            </ChakraProvider>
        </RecoilRoot>
    );
}