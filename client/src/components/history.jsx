import React, { useEffect , useState} from "react";
import {Link} from "react-router-dom"; 

import axios from "axios";

import "./style.css";

import LoadingPage from "./loading";

const History = () => {

    const [productDetails , setProductdetails] = useState([]);
    const [loading , setLoading] = useState(true);


    useEffect(() => {
        getHistory();   
    } , [])

    function getHistory(){

        axios.get("http://localhost:3001/getProductHistory")
        .then((res) => {
            setProductdetails(res.data.details)
            setLoading(false);
            console.log(res.data.details)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return(
        <>
        {
            !loading?
                <div class="container-fluid table-container">
                    <h1>Scraping records of the product</h1>
                    <table class="table table-bordered table-dark table-striped text-center">
                        <thead class="text-white">
                            <th>Product Id</th>
                            <th>Discover the Sentiment</th>
                        </thead>
                        <tbody>
                            {productDetails.map((product) => {
                                return(
                                    <tr>
                                        <td><h6>{product}</h6></td>
                                        <td>
                                            <Link to={`/display/${product}`}>
                                                <button class="btn btn-md bg-primary text-white">Get Analysis</button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>    
            :<LoadingPage/>
        }
            
        </>
    );
}

export default History;