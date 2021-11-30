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
  const [shardData, setShardData] = useState([]);
  const [gotData, setGotData] = useState(false);
  const [effectiveStakeByShardData, setEffectiveStakeByShardData] = useState([]);

  useEffect(() => {
    if (shardData.length === 0) {
      getSuperCommitties(setShardData);
      setGotData(true);
      setEStakeByShardData(shardData, setEffectiveStakeByShardData);
    } else {
      setEStakeByShardData(shardData, setEffectiveStakeByShardData);
    }
  }, [shardData, gotData]);

  return (
    <div className="App">
      <Heading />
      <Chart
        width={'600px'}
        height={'400px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={
          effectiveStakeByShardData
        }
        
        options={{
          title: 'Effective Stake by Shard',
          // Just add this option
          //is3D: true,
          pieHole: 0.4,
        }}

        rootProps={{ 'data-testid': '2' }}
      />
      {gotData && <Shards shardData={shardData} />}
    </div>
  );
}

export default App;
