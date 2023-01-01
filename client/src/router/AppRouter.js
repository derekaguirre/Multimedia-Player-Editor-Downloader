import 'bootstrap/dist/css/bootstrap.min.css';
import { AnimatePresence } from "framer-motion";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import SongPage from "../components/main-page/song-page";
import NavBar from "../components/nav-bar/Navbar";



function Animated() {
    const location = useLocation();
    return(
        <AnimatePresence mode="wait">
            <Routes location= {location} key = {location.pathname}>
                <Route path = "/" element ={<SongPage/>}></Route>
            </Routes>
        </AnimatePresence>
    );

}

export default function AppRouter(){
    return (
        <div className = "AppRouter">
            <>
            <Router>
                <NavBar />
                <Animated/>
            </Router>
            </>
        </div>
    )
}