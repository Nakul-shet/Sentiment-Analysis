import React , {useState} from "react";
import axios from "axios";
import LoadingPage from "./loading";
import Nav from "./navigation";

import "./style.css";

import {useNavigate} from "react-router-dom";

const Form = () => {


    const navigate = useNavigate();

    const [productid , setProductid] = useState("");

    const [available , setAvailable] = useState(false);
    const [loading , setLoading] = useState(false);

    function handleChange(e){

        setProductid(e.target.value);
    }

    function handleSubmit(e){

        e.preventDefault();

        setLoading(true);

        axios.post('http://localhost:3001/product' , {id : productid})
        .then((res) => {
            setProductid(res.data.id)
            setAvailable(true)
            setLoading(false)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function handleAnalyze(e){
        
        e.preventDefault();

        navigate(`/display/${productid}`);
    }

    return(
        <>
        <Nav/>
        {
            !loading ? 
                <div class="container-fluid form-container">
                    <div class="form-sub-container">
                        <h1>Enter the Amazon Product ID</h1>
                        <form onSubmit={handleSubmit}>
                            <input class="form-control" onChange={handleChange} type="text" placeholder="eg: B09B5F3QBH (Find it in the product URL)"/>

                            {/* <div style={{textAlign : "center"}}>
                                <label>Choose review extraction settings</label>
                                <select class="form-control">
                                    <option value={preference.moderate}>Moderate</option>
                                    <option onSelect={(e) => {setPref(e.target.value); console.log(e.target.value)}} value={preference.high}>High</option>
                                    <option value={preference.extreme}>Extreame</option>
                                </select>
                            </div>
                            
                            <br/> */}
                            <button class="btn btn-md bg-primary text-white" type="submit">Scrape Product Reviews</button>
                        </form>

                    </div>
                    
                    {
                        available? 
                            <div class="form-sub-result-container result-container">
                                <h2>Your Results for product is ready</h2>
                                <button class="btn btn-md bg-danger text-white" onClick={handleAnalyze}>Produce Sentiment Analysis: {productid}</button> 
                            </div>
                            
                        : ""
                    }
                </div>
            : <LoadingPage/>
        }
            
        </>
    );
}

export default Form;