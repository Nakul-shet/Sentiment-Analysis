import React, { useEffect , useState} from 'react';
import { Doughnut , Bar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

import { useParams , Link, Navigate} from 'react-router-dom';

import LoadingPage from './loading';

import axios from "axios";

const BarChart = () => {

  const {product} = useParams();

  const [positive , setPositive] = useState(0);
  const [neutral  , setNeutral] = useState(0);
  const [negative , setNegative] = useState(0);
  const [title , setTitle] = useState("");
  const [picture , setPicture] = useState("");
  const [about , setAbout] = useState([]);
  // const [top , setTop] = useState([]);
  // const [percent , setPercent] = useState({})

  const [sentiment , setSentiment] = useState("");

  const [userData , setUserdata] = useState({
    labels : ['Positive' , 'Neutral' , 'Negative'],
    datasets : [
      {
        label : "Average Count",
        data : [10 ,20 ,30],
        backgroundColor: ['green','yellow','red']
      }
    ]
  })

  const positiveStyle = {
    color : "green"
  }

  const negativeStyle = {
    color : "red"
  }

  const neutralStyle = {
    color:"yellow"
  }

  useEffect(() => {

        axios.post('http://localhost:3001/analyze' , {id : product})
        .then((res) => {
            setPositive(res.data.positive)
            setNegative(res.data.negative)
            setNeutral(res.data.neutral)
            setTitle(res.data.title)
            setPicture(res.data.displayImage)
            setAbout(res.data.about)
            // setTop(res.data.topResult)

            setSentiment(res.data.sentiment)

            // const totalSentiment = positive + negative + neutral;
            // const percentage = {
            //   positivePercentage : 100 * (res.data.positive)/totalSentiment,
            //   neurtalPercentage : 100 * (res.data.neutral)/totalSentiment,
            //   negativePercentage : 100 * (res.data.negative)/totalSentiment
            // }
            // setPercent(percentage);

            setUserdata((prev) => {
              return(
                {
                  ...prev,
                  datasets : [{data : [res.data.positive , res.data.neutral , res.data.negative]}]
                }
              );
            })

        })
        .catch((err) => {
            console.log(err)
        })
  } , [])

  const [threshold , setThreshold] = useState(0);

  const total = (Number(positive)) + (Number(negative)) + (Number(neutral));
  const neutralPercentage = Math.round((100 * neutral) / total);
  const positivePercentage = Math.round((100 * positive) / total);
  const negativePercentage = Math.round((100 * negative) / total);

  const posPercentage = positivePercentage + "%";

  function handleTrack(){

    if(threshold != null && threshold != 0){
        axios.post("http://localhost:3001/track" , {
          Total : total,
          positive : positivePercentage,
          negative : negativePercentage,
          neutral : neutralPercentage,
          productId : product,
          threshold : threshold
        })
    }else{
      return;
    }

  }

    return(
        <>
          {
            positive > 1 ?
                <div class="row">

                    <nav class="navbar navbar-expand-lg text-white info-navbar">
                        <ul class="navbar-nav">

                          <li class="nav-item">
                            <Link style={{color : "white"}} class="btn btn-md btn-primary text-white" to="/">
                              Main Menu
                            </Link>
                          </li>

                          <li class="nav-item">
                            <Link style={{color : "white"}} class="btn btn-md btn-outline-info text-white" to={`/getRetreives/${product}`}>
                              Get Product Reviews
                            </Link>
                          </li>

                          <li class="nav-item">
                            <Link style={{color : "white"}} class="btn btn-md btn-outline-danger text-white" to={`/percentage/${positive}/${negative}/${neutral}`}>
                              Percentage
                            </Link>
                          </li>

                          {/* <li class="nav-item">
                            <Link style={{color : "white"}} class="btn btn-md btn-outline-primary text-white" to={`/track/${positive}/${negative}/${neutral}/${product}`}>
                              Track Product
                            </Link>
                          </li> */}
                        </ul>
                    </nav>

                    <div class="col-lg-6 first">
                      <h1>User Experience Feedback Chart</h1>
                      <div class="container graph-container">
                        <Doughnut data={userData}/>
                        <br/>
                        <div style={{textAlign : "center"}}>
                          <h5>Reviews Analyized for Sentiment : <span style={{color : "orange"}}>{positive + negative + neutral}</span></h5>
                          <h4>Positive: <span style={positiveStyle}>{positive}</span> Negative: <span style={negativeStyle}>{negative}</span> Neutral: <span style={neutralStyle}>{neutral}</span></h4>
                          <br/>
                          <h2>Overall Sentiment: <span class="result">{sentiment}</span></h2>
                        </div>
                      </div>

                      <div class="custom-tracker">
                        <h3>Surveillance Parameter</h3>
                          <form align="left">
                            <div class="form-group">
                                <label>Current Product Sentiment Percentage</label>
                                <input style={{backgroundColor : "yellow" , color : "black"}} value={posPercentage} class="form-control" readOnly/>
                            </div>
                            <br/>
                            <div class="form-group">
                                <label>Set Threshold</label>
                                <input onChange={e => setThreshold(e.target.value)} type="number" class="form-control" max={"100"} required/>
                            </div>
                            <br/>
                            <Link to="/">
                                <button onClick={handleTrack} class="btn bg-danger text-white">Track</button>
                            </Link>
                          </form>
                      </div>

                    </div>

                    <div class="col-lg-6 second">
                      <div class="product-heading">
                        <h3>PRODUCT SPECIFICATION & DETAILS</h3>
                      </div>
                      <div class="product-title">
                          <strong>{title}</strong>
                      </div>
                      <div>
                          <img src={`${picture}`}/>
                      </div>
                      <div class="product-info">
                        <h4>About this Product</h4>
                            <ul>
                                {about.map((ab) => {
                                return(
                                  <li>{ab}</li>
                                );
                                })}
                            </ul>
                      </div>

                    </div>

                </div>
              : <LoadingPage/>
          }
          
        </>
    );
}

export default BarChart;