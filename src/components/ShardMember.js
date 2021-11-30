import React from 'react'
import { formatONE } from '../utils/numberFormat'
import { useEffect, useState } from 'react';
import { getValidatorName } from '../rpc/rpcclient';

const ShardMember = ({member, shardStake, shardSlots}) => {
   const [name, setName] = useState(null);
   useEffect(() => {
        if (!name) {
            if (member.isHarmony)
                setName('Harmony')
                else
                    getValidatorName(member.address, setName)
        }
   }, [name, member]);

   const stakePercent = member.effectiveStake / shardStake * 100;
   const slots = member.keys.length;
   const slotPercent = slots / shardSlots * 100;
    return (
        <div className='shard-member'>
            <div>{name ? name : member.address} - Stake: {formatONE(member.effectiveStake)} ({stakePercent.toFixed(2)}%) - Slots: {slots} ({slotPercent.toFixed(2)}%)</div>
        </div>
    )
}

export default ShardMember
