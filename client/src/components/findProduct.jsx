import React , {useState} from "react";
import axios from "axios";
import LoadingPage from "./loading";

import { useNavigate } from "react-router-dom";

import "./style.css";

const Find = () => {

    const navigate = useNavigate();

    const [rpa , setrpa] = useState("");
    const [proId , setProId] = useState("");
    const [loading , setLoading] = useState(false);

    function handleRPA(e){
        e.preventDefault();

        setLoading(true)

        axios.post("http://localhost:3001/getProductId" , {productName : rpa})
        .then((res) => {
            setProId(res.data)
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function handleCopy(){

        navigator.clipboard.writeText(proId)
        alert("Code Copied")

        navigate('/' , {replace : true})
    }

    return(
        <>
        {
            !loading ?

            <div class="container-fluid find-container">
                <div class="find-form">
                    <h1 style={{textAlign : "center" ,backgroundColor : "#000d33" , color : "white" , padding : "15px" , border : "7px double white" , borderRadius : "10px" }}>Find Product ID</h1>
                    <br/>
                    <form onSubmit={handleRPA}>
                        <div class="form-group">
                            <input class="form-control" onChange={(e) => setrpa(e.target.value)} type="text" placeholder="Enter the Product Name"/>
                        </div>
                        <br/>
                        <button class="btn btn-md bg-primary text-white" type="submit">Submit</button>
                    </form>
                    <br/>

                    {
                    
                        proId != "" ? 
                        
                        <div class="product-id-result">
                            <h3>The product code you searched for is...{proId} <span class="copy" onClick={handleCopy}>Copy code</span></h3> 
                        </div>

                        
                        : ""
                    }
                </div>
            </div>

            : <LoadingPage/>
        }
            
        </>
    );
}

export default Find;