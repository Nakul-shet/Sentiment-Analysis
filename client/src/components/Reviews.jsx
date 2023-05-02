import React, { useEffect , useState } from "react";
import axios from "axios";
import { useNavigate , useParams} from "react-router-dom";
import LoadingPage from "./loading";

const Reviews = () => {

    const [reviews , setReviews] = useState([{}])
    const [loading , setLoading] = useState(true)

    const {product} = useParams();

    useEffect(() => {
        axios.post('http://localhost:3001/getReviews' , {productId : product})
        .then((res) => {
            setReviews(res.data)
            setLoading(false)
        })
        .catch((err) => {
            console.log(err)
        })
    } , [])

    return(
        <>
            {
                loading ? 
                <LoadingPage/> :

                <div class="container-fluid review-container">
                    <h3>Consumer testimonials of Product : {product}</h3>
                    {reviews.map((rev) => {
                        if(rev.review.length > 300){
                            return(
                                <div class="review">
                                    <q>{rev.review.replace(
                                        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                                        ''
                                        )
                                        .replace(/\s+/g, ' ')
                                        .trim()}
                                    </q>
                                </div>
                            );
                        }
                    })}
                </div>
            }
        </>
    );
}

export default Reviews;