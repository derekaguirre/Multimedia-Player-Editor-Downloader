import { AnimatePresence } from "framer-motion";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
// import Navbar from "../components/nav-bar/Navbar";


import SongPage from "../components/main-page/song-page";

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
                {/* <NavBar /> */}
                <Animated/>
            </Router>
            </>
        </div>
    )
}