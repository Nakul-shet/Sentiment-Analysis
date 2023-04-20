import React from "react";

import {Link} from "react-router-dom";

import axios from "axios";

import "./style.css";

const Nav = () => {

    function handleClick(){

        axios.get('http://localhost:3001/test')
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
        })


    }

    return(
        <>
            <nav class="navbar navbar-expand-lg">

                <a class="navbar-brand"><h3>Sentiment Analysis of Amazon Product Review</h3></a>

                <ul class="navbar-nav">
                    <li class="nav-item product-link">
                        <Link to="/displayHistory">
                            <button class="btn btn-danger">Product History</button>
                        </Link>

                        <button onClick={handleClick} class="btn btn-md">Get Results</button>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Nav;