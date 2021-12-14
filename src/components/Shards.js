import React from 'react'
import Shard from './Shard'

const Shards = ({ shardData }) => {
    //console.log('Shards rendering with ')
    //console.log(shardData)
    return (
        <>
            <div className="row">
                <Shard key={shardData[0].shardId} shard={shardData[0]} />
                <Shard key={shardData[1].shardId} shard={shardData[1]} />
            </div>
            <div className="row">
                <Shard key={shardData[2].shardId} shard={shardData[2]} />
                <Shard key={shardData[3].shardId} shard={shardData[3]} />
            </div>
        </>
    )
}

export default Shards
