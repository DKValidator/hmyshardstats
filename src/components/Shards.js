import React from 'react'
import Shard from './Shard'

const Shards = ({ shardData }) => {
    //console.log('Shards rendering with ')
    //console.log(shardData)
    return (
        <div>
            {
                shardData.map(shard => (
                    <Shard key={shard.shardId} shard={shard} />
                ))
            }
        </div>
    )
}

export default Shards
