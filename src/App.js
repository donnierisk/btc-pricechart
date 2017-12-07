import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Chart from 'chart.js';

class App extends Component {

  state = {
    btcPrice: [],
    loaded:false,
    errorState:false
  }

  buildChart(){
    console.log('building chart');
    const ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
        label: 'Bitcoin Price',
        data: [this.state.btcPrice],
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

  requestData=()=>{
    let myChart = '';

    axios({
      method:'get',
      url:`https://api.coinbase.com/v2/prices/BTC-ZAR/spot`})
      .then(response =>{
          let newStateArray = this.state.btcPrice.slice();
          newStateArray.push(response.data.data.amount);
          
          this.setState({
            btcPrice: newStateArray,
            loaded:true
          })
            myChart = this.buildChart();

    }).catch(error =>{
      console.log(error);
      this.setState({
        errorState:true
      })
      throw error;
    });

    if(!this.state.errorState){
      const requestInterval = setInterval(()=>{
        axios({
          method:'get',
          url:`https://api.coinbase.com/v2/prices/BTC-ZAR/spot`})
          .then(response =>{
            let newStateArray = this.state.btcPrice.slice();
            newStateArray.push(response.data.data.amount);
            
            this.setState({
              btcPrice: newStateArray,
              loaded:true
            })
            this.addData(myChart,this.state.btcPrice.length-1,this.state.btcPrice[this.state.btcPrice.length-1]);
        }).catch(error =>{
            
            this.setState({
              errorState:true,
            })
            clearInterval(requestInterval);
            throw error;
        });
        
      },15000)
    }
  }
  
  componentDidMount(){
    if(!this.state.errorState)
      this.requestData();
  }

  render() {
    if(this.state.errorState){
      return(
        <div className="App">
          <h1>Bitcoin Spot Price Chart (Rand)</h1>
          <p>There was a problem loading the chart</p>
          <button onClick={this.requestData}>Please click here to try again</button>          
        </div>
      );
    }
    if(!this.state.loaded){
      return(
        <div className="App">
          <h1>Bitcoin Spot Price Chart</h1>
          <p>Please wait while chart is loading...</p>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <h1>Bitcoin Spot Price Chart</h1>
          <canvas id="myChart"></canvas>
        </div>
    );
    }
  }
}

export default App;
