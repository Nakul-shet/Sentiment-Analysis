import React, { useEffect , useState} from "react";

import {Link} from "react-router-dom";

import "./style.css"

import axios from "axios";
import LoadingPage from "./loading";

const Tracker = () => {

    const [tracked , setTracked] = useState([{}]);
    const [loading , setLoading] = useState(true);

    useEffect(() => {

        axios.get("http://localhost:3001/getTracked")
        .then((res) => {
            setTracked(res.data);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err)
        })

    } , [])

    function handleReload(){

        window.location.reload();
    }

    function getRecommendation(sentiment){

        if(sentiment >= 70){
            if(sentiment >= 80){
                if(sentiment >= 90){
                    return "⭐⭐⭐⭐⭐"
                }
                return "⭐⭐⭐⭐"
            }
            return "⭐⭐⭐"
        }else if(sentiment <= 70 && sentiment >= 50){
            return "⭐⭐"
        }else{
            return "⭐"
        }
    }

    

    function getRecommendationColor(sentiment){

        if(sentiment > 70){
            return "green :star"
        }else{
            return "red"
        }
    }

    return(
        <>
            {
                loading?
                <LoadingPage/> :
                <div class="container tracked-container">
                    <h1>Tracking Products</h1>
                    <div class="options"> 
                        <a href="/" class="btn btn-md btn-primary">Main Menu</a>
                        <button onClick={handleReload} class="btn btn-md bg-danger text-white">Reload</button>
                    </div>
                    <br/>
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Product Details</th>
                                <th>Analyzed Sentiment</th>
                                <th>Current Sentiment</th>
                                <th>Neutral</th>
                                <th>Negative</th>
                                <th>Sentiment Based Ratings</th>
                                <th>Target Value</th>
                                <th>Disparity rate</th>
                                <th colSpan={"2"}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tracked.map((tra) => {
                                return(
                                    <tr>
                                        <td>
                                            <img width={"150px"} src={tra.productImage}/>
                                        </td>
                                        <td>{tra.productTitle.trim()}</td>
                                        <td>{tra.total}</td>
                                        <td>
                                            <mark style={{backgroundColor : "yellow", fontWeight : "bold"}}>{tra.positive} %</mark>
                                        </td>
                                        <td>{tra.neutral} %</td>
                                        <td>{tra.negative} %</td>
                                        <td style={{color : getRecommendationColor(tra.positive)}}>
                                            {getRecommendation(Number(tra.positive))}
                                        </td>
                                        <td style={{color : "green" , fontWeight : "bold"}}>{tra.threshold} %</td>
                                        <td style={{color : "red"}} align="center">
                                            {Number(tra.threshold) - Number(tra.positive)} %
                                        </td>
                                        <td>
                                            <a href={`https://www.amazon.in/dp/${tra.productId}`} target="_blank" class="btn btn-md bg-primary text-white">Buy</a>
                                        </td>
                                        <td>
                                            <Link to={`/removeTrack/${tra.productId}`}>
                                                <button class="btn btn-md bg-danger text-white"><i class="fa-sharp fa-solid fa-trash"></i></button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            }
        </>
    );
}

export default Tracker;