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

const router = createBrowserRouter([
    {
        path: "/",
        element: <Page footer defaultPadding={false}><Home/></Page>,
    },
    {
        path: "/dashboard",
        element: <Page header footer><Dashboard/></Page>,
    },
    {
        path: "/browse",
        element: <Page header footer><Browse/></Page>,
    },
    {
        path: "/games/:id",
        element: <Page header footer><Product type="GAME"/></Page>,
    },
    {
        path: "/brands/:id",
        element: <Page header footer><Product type="BRAND"/></Page>,
    },
    {
        path: "/about",
        element: <Page header footer><About/></Page>,
    },
]);

export default function App() {
    return (
        <RecoilRoot>
            <ChakraProvider>
                <DialogsRoot>
                    <RouterProvider router={router}/>
                </DialogsRoot>
            </ChakraProvider>
        </RecoilRoot>
    );
}