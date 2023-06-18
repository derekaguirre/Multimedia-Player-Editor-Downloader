import 'bootstrap/dist/css/bootstrap.min.css';
import { AnimatePresence } from "framer-motion";
import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import SongPage from "../components/main-page/main-page";



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
                <Animated/>
            </Router>
            </>
        </div>
    )
}