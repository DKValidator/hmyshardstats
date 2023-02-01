import './App.css';
import { useEffect, useState } from 'react';
import { getSuperCommitties } from './rpc/rpcclient'
import Shards from './components/Shards'
import { Chart } from "react-google-charts";
import Heading from "./components/Heading"
import { validatorNames as initialNames } from './rpc/validatornames';

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
  const [validatorNames, setValidatorNames] = useState(initialNames)

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
      <div className='top-box'>
        {gotData &&
          <Chart
            width={'100%'}
            height={'350px'}
            chartType="PieChart"

            loader={<div>Loading Chart...</div>}
            data={
              effectiveStakeByShardData
            }

            options={{
              title: 'Effective Stake by Shard',
              titleTextStyle: { color: 'white', fontSzie: 16, fontName: 'Nunito' },
              backgroundColor: "#393636",
              colors: ['#00AEE9', '#FF6F00', '#FFB800', '#69FABD'],
              // Just add this option
              //is3D: true,
              pieHole: 0.4,
              legend: { position: 'right', textStyle: { color: 'white', fontSize: 16, fontName: 'Nunito' } }
            }}

            rootProps={{ 'data-testid': '2' }}
          />
        }
      </div>
      {gotData && <Shards shardData={shardData} validatorNames={validatorNames} setValidatorNames={(names) => setValidatorNames(names)} />}
    </div>
  );
}

export default App;
