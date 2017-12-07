import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Chart from 'chart.js';

class App extends Component {

  state = {
    btcPrice: []
  }

  buildChart(){
    console.log('building chart');
    const ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
        label: 'Bitcoin Price',
        data: 0,
        }]
      }
    }
    );
    return myChart;
  }

  addData(chart, label, data) {
    console.log('adding to chart');
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
  }

  requestData(){
    let getCounter = 0;
    let myChart = '';

    setInterval(()=>{
      axios({
        method:'get',
        url:`https://api.coinbase.com/v2/prices/BTC-ZAR/spot`})
        .then(response =>{
            let newStateArray = this.state.btcPrice.slice();
            newStateArray.push(response.data.data.amount);
            
            this.setState({
              btcPrice: newStateArray
            })

            if(getCounter === 0){
              myChart = this.buildChart();
            }
            else {
              this.addData(myChart,this.state.btcPrice.length-1,response.data.data.amount);
            }
            getCounter++;

      }).catch(error =>{
        console.log(error);
      });
      
    },15000)
  }
  
  componentDidMount(){
    this.requestData();
  }

  render() {
    return (
      <div className="App">
        <canvas id="myChart"></canvas>
      </div>
    );
  }
}

export default App;
