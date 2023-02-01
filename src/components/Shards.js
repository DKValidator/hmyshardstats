import React from 'react'
import Shard from './Shard'

const Shards = ({ shardData, validatorNames, setValidatorNames }) => {
    return (
        <div>
            {
                shardData.map(shard => (
                    <Shard key={shard.shardId} shard={shard} validatorNames={validatorNames} setValidatorNames={(names) => setValidatorNames(names)}  />
                ))
            }
        </div>
    )
}

export default Shards
