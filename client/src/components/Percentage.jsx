import React, { useEffect , useState} from "react";
import { useParams } from "react-router-dom";

import { Doughnut , Bar , Radar , PolarArea} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

const Percentage = () => {

    const {positive , negative , neutral } = useParams();

    const total = (Number(positive)) + (Number(negative)) + (Number(neutral));

    const neutralPercentage = (100 * neutral) / total;
    const positivePercentage = (100 * positive) / total;
    const negativePercentage = (100 * negative) / total;

    const userData = {
        labels : ['Positive' , 'Neutral' , 'Negative'],
    datasets : [
      {
        label : "Average Count",
        data : [positivePercentage ,neutralPercentage ,negativePercentage],
        backgroundColor: ['purple','yellow','red']
      }
    ]
    }

    const polarData = {
        labels: [
          'Positive',
          'Neutral',
          'Negative'
        ],
        datasets: [{
          label: 'Sentiment in Percent',
          data: [positivePercentage, neutralPercentage, negativePercentage],
          backgroundColor: [
            'orange',
            'purple',
            'red'
          ]
        }]
      };

    return(
        <>
            {/* <p>{total}</p>
            <p>{Math.round(positivePercentage)}</p>
            <p>{Math.round(negativePercentage)}</p>
            <p>{Math.round(neutralPercentage)}</p> */}

            {/* <div class="container" style={{width : "500px"}}>
                <Bar data={userData}/>
            </div> */}

            <div style={{padding : "50px 400px"}} class="container-fluid percentage-container">
                {/* <h1>{title}</h1> */}
                <PolarArea data={polarData}/>
            </div>
        </>
    );
}

export default Percentage;