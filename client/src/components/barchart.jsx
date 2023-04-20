import React, { useEffect , useState} from 'react';
import { Doughnut , Bar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

import { useParams } from 'react-router-dom';

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

            const totalSentiment = positive + negative + neutral;
            const percentage = {
              positivePercentage : 100 * (res.data.positive)/totalSentiment,
              neurtalPercentage : 100 * (res.data.neutral)/totalSentiment,
              negativePercentage : 100 * (res.data.negative)/totalSentiment
            }

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

    return(
        <>
          {
            positive > 1 ? 
                <div class="row">
                    <div class="col-lg-6 first">
                      <h1>User Experience Feedback Chart</h1>
                      <div class="container graph-container">
                        <Doughnut data={userData}/>
                        <br/>
                        <h5>Reviews Analyized for Sentiment : <span style={{color : "orange"}}>{positive + negative + neutral}</span></h5>
                        <h4>Positive: <span style={positiveStyle}>{positive}</span> Negative: <span style={negativeStyle}>{negative}</span> Neutral: <span style={neutralStyle}>{neutral}</span></h4>
                        <br/>
                        <h2>Overall Sentiment: <span class="result">{sentiment}</span></h2>
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

                    {/* <div class="container-fluid review-container">
                      <div class="top-result">
                        <h3>Few Product Reviews :</h3>
                          {top.map((t) => {
                            return(
                              <blockquote class="each-review">{t}</blockquote>
                            );
                          })}
                      </div>
                    </div> */}

                </div>
              : <LoadingPage/>
          }
          
        </>
    );
}

export default BarChart;