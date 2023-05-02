import React from "react";
import axios from "axios";
import { useParams , useNavigate , Link} from "react-router-dom";

import "./style.css"

const RemoveTrack = () => {

    const {product} = useParams();
    const navigate = useNavigate();

    function handleDelete(){

        axios.post('http://localhost:3001/removeTrack' , {productId : product})
        .then((res) => {
            alert(res.data)
        })
    }

    return(
        <>
            <div class="container-fluid delete-container">
                <div class="option">
                    <small style={{color : "red"}}>(Deleting will erase the track status)</small>
                    <h1>{product}</h1>
                    <br/>
                    <Link to="/">
                        <button class="btn btn-md bg-danger text-white" type="submit" onClick={handleDelete}>Delete</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default RemoveTrack;