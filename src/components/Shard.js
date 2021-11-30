import React from 'react'
import ShardMember from './ShardMember'
import { useEffect, useState } from 'react';
import { formatONE } from '../utils/numberFormat'
import { Chart } from "react-google-charts";
import { setValidatorNames, setValidatorNames2 } from '../rpc/rpcclient'

function setEStakeByValidatorData(shardData, setdata) {
    //console.log(shardData);
    let data = [['Validator', 'Effective Stake']];

    shardData.committeeMembers.map(shard => (
        data.push([shard.address, shard.effectiveStake])
    ));

    setdata(data)
}

function getValidatorList(shardData, totalSlots) {
    let data = [['Validator', 'Effective Stake', 'Slots', 'Slot %']]
    if (shardData)
        shardData.map(shard => (
            data.push([shard.name ? shard.name : shard.address, shard.effectiveStake, shard.keys.length, shard.keys.length / totalSlots * 100])
        ));

    return data
}
const Shard = ({ shard }) => {

    const [validatorStakeByShardData, setValidatorStakeByShardData] = useState([]);

    const [shardCommittee, setShardCommittee] = useState(null);
    const [gotData, setGotData] = useState(false);

    useEffect(() => {
        if (validatorStakeByShardData && !gotData)
            setValidatorNames2(validatorStakeByShardData, setValidatorStakeByShardData, setGotData)
    }, [validatorStakeByShardData, gotData])

    useEffect(() => {
        if (!shardCommittee && shard) {
            const committee = shard.committeeMembers.filter(v => v.isHarmony === false);
            committee.sort((a, b) => parseFloat(b.effectiveStake) - parseFloat(a.effectiveStake));
            setShardCommittee(committee);
        }
    }, [shard, shardCommittee])

    useEffect(() => {
        if (shardCommittee)
            setValidatorNames(shardCommittee, setShardCommittee);

    }, [shardCommittee])

    useEffect(() => {
        if (shard) {
            setEStakeByValidatorData(shard, setValidatorStakeByShardData);
            setGotData(false);
            //setValidatorNames(shard, setValidatorStakeByShardData)
        }
    }, [shard]);

    return (
        <div className="shard-box">
            <h1>Shard {shard.shardId}</h1>
            <Chart
                className="chart"
                width={'600px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={
                    validatorStakeByShardData
                }

                options={{
                    title: 'Validator Stake by Shard',
                    // Just add this option
                    //is3D: true,
                    //pieHole: 0.4,
                    sliceVisibilityThreshold: 0.05, // 20%
                }}

                rootProps={{ 'data-testid': '2' }}
            />
            <div>Stake: {formatONE(shard.totalStake)}</div>
            <div>Validators: {shard.committeeMembers.length + 1}</div>
            <div>Total Slots: {shard.totalSlots}</div>
            <div>External Slots: {shard.totalExternalSlots}</div>
            <br />
            <Chart
                width={'600px'}
                height={'600px'}
                chartType="Table"
                loader={<div>Loading Chart</div>}
                data={getValidatorList(shardCommittee, shard.totalSlots)}
                options={{
                    showRowNumber: false,
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        </div>
    )
}

export default Shard