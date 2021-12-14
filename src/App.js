import './App.css';
import { useEffect, useState } from 'react';
import { getSuperCommitties } from './rpc/rpcclient'
import Shards from './components/Shards'
import { Chart } from "react-google-charts";
import Heading from "./components/Heading"

function setEStakeByShardData(shardData, setdata) {
  let data = [['Shard', 'Effective Stake']];
  shardData.map(shard => (
    data.push(['Shard ' + shard.shardId, shard.totalStake])
  ));
  //console.log(data);
  setdata(data)
}

function App() {
  const [currentShardData, setCurrentShardData] = useState([]);
  const [prevShardData, setPrevShardData] = useState([]);
  const [gotData, setGotData] = useState(false);
  const [currentEffectiveStakeByShardData, setCurrentEffectiveStakeByShardData] = useState([]);
  const [prevEffectiveStakeByShardData, setPrevEffectiveStakeByShardData] = useState([]);
  const [displayEpoch, setDisplayEpoch] = useState('current');
  const [epochs, setEpochs] = useState(null);

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (currentShardData.length === 0) {
      getSuperCommitties(setCurrentShardData, setPrevShardData, setEpochs);
      setGotData(true);
    }
    setEStakeByShardData(currentShardData, setCurrentEffectiveStakeByShardData);
    setEStakeByShardData(prevShardData, setPrevEffectiveStakeByShardData);

  }, [currentShardData, prevShardData, epochs, gotData]);
useEffect(() => {
  
  switch(displayEpoch) {
    case 'current' : setChartData(currentEffectiveStakeByShardData);
    break;
    case 'previous' : setChartData(prevEffectiveStakeByShardData);
    break;
    default : setChartData(currentEffectiveStakeByShardData);
  }
 // console.log(chartData)
}, [displayEpoch, currentEffectiveStakeByShardData, prevEffectiveStakeByShardData, chartData])


  const epochOnClick = (epoch) => {
    console.log('Setting epoch: ' + epoch)
    setDisplayEpoch(epoch);
  }

  return (
    <div className="App">
      <Heading />
      <div className="sub-heading">
        <h2>Epoch</h2>
        <button onClick={() => epochOnClick('previous')}>Prev</button>
        <button onClick={() => epochOnClick('current')}>Current</button>
      </div>
      <div className="row">
        <div className="shard-box">
          <h1>Epoch: { epochs ? epochs[displayEpoch] + '(' + displayEpoch + ')' : 'Loading...'}</h1>
        </div>
        <div className="shard-box">
          { chartData && <Chart
            width={'100%'}
            height={'350px'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={chartData}
            

            options={{
              title: 'Effective Stake by Shard',
              // Just add this option
              //is3D: true,
              pieHole: 0.4,
              chartArea: {
                // leave room for y-axis labels
                width: '94%'
              },
              legend: {
                position: 'top'
              },
              width: '100%'
            }}

            rootProps={{ 'data-testid': '2' }}
          />}
        </div>
      </div>

      {gotData & currentShardData.length > 0 & displayEpoch === 'current' && <Shards shardData={currentShardData} />}
      {gotData & prevShardData.length > 0 & displayEpoch === 'previous' && <Shards shardData={prevShardData} />}
    </div>
  );
}

export default App;
