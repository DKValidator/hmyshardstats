import React from 'react'
import { useEffect, useState } from 'react';
import { formatONE } from '../utils/numberFormat'
import { Chart } from "react-google-charts";
import { updateValidatorNames } from '../rpc/rpcclient'

const Shard = ({ shard, validatorNames, setValidatorNames }) => {
    const [validatorStakeByShardData, setValidatorStakeByShardData] = useState([]);

    const [shardCommittee, setShardCommittee] = useState(null);

    const [update, setUpdate] = useState(false);

    function getValidatorId(address) {
        if (!validatorNames)
            return address;

        if(validatorNames[address])
            return validatorNames[address]

        else
            return address
    }

    function setEStakeByValidatorData(shardData, setdata) {
        //console.log(shardData);
        let data = [['Validator', 'Effective Stake']];

        shardData.committeeMembers.map(validator => (
            data.push([getValidatorId(validator.address), validator.effectiveStake])
        ));

        setdata(data)
    }

    function getValidatorList(shardData, totalSlots, totalStake) {
        let data = [['Validator', 'Effective Stake', 'Stake %', 'Slots', 'Slot %']]
        if (shardData)
            shardData.map(validator => (
                data.push([getValidatorId(validator.address), validator.effectiveStake, validator.effectiveStake / totalStake * 100, validator.keys.length, validator.keys.length / totalSlots * 100])
            ));

        return data
    }

    useEffect(() => {
        if ((!shardCommittee && shard) || update) {
            const committee = shard.committeeMembers.filter(v => v.isHarmony === false);
            committee.sort((a, b) => parseFloat(b.effectiveStake) - parseFloat(a.effectiveStake));
            setShardCommittee(committee);
            setUpdate(false)
        }
    }, [shard, shardCommittee, update])

    useEffect(() => {
        if (shardCommittee) {
            updateValidatorNames(shardCommittee, setUpdate, validatorNames, setValidatorNames);
        }

    }, [shardCommittee, setUpdate, validatorNames, setValidatorNames])

    useEffect(() => {
        if ((shard && shardCommittee) || update) {
            setEStakeByValidatorData(shard, setValidatorStakeByShardData);
        }
    }, [shard, shardCommittee, setValidatorStakeByShardData, update]);

    return (
        <div className="shard-box">
            <h1>Shard {shard.shardId}</h1>
            <Chart
                className="chart"
                width={'100%'}
                height={'350px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={
                    validatorStakeByShardData
                }

                options={{
                    title: 'Validator Effective Stake',
                    titleTextStyle: { color: 'white', fontSzie: 16, fontName: 'Nunito' },
                    backgroundColor: "#393636",
                    legend: { position: 'right', textStyle: { color: 'white', fontSize: 16, fontName: 'Nunito' } },
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
                width={'100%'}
                height={'600px'}
                chartType="Table"
                loader={<div>Loading Chart</div>}
                data={getValidatorList(shardCommittee, shard.totalSlots, shard.totalStake)}
                options={{
                    showRowNumber: false,
                    backgroundColor: "#393636",
                    cssClassNames: {
                        headerRow: 'table-header',
                        tableRow: 'table-row',
                        oddTableRow: 'table-row',
                    },
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        </div>
    )
}

export default Shard
