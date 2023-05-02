import React from "react";
import axios from "axios";
import { useParams , useNavigate , Link} from "react-router-dom";

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
            <h1>{product}</h1>
            <Link to="/">
                <button type="submit" onClick={handleDelete}>Delete</button>
            </Link>
        </>
    );
}

export default RemoveTrack;