export class Shard {
    constructor(data, shard, epoch) {
        this.shardId = shard;
        this.totalSlots = data.count;
        this.totalExternalSlots = data['external-validator-slot-count'];
        this.totalStake = Number(data['total-effective-stake'])  / 1000000000000000000;
        this.committeeMembers = this.getCommitee(data['committee-members']);
        this.epoch = epoch;
    }

    getCommitee(data) {
        let committee = [];
        //console.log('Get committee');
        //console.log(data);
        for (let i = 0; i < data.length; i++) {
            const member = data[i];

            const keyData = {
                key: member['bls-public-key'],
                effectiveStake: Number(member['effective-stake']) / 1000000000000000000
            }

            //look for existing validator
            let foundExisting = false;
            if (committee.length > 0)
                for (let j = 0; j < committee.length; j++) {
                    if (committee[j].address === member['earning-account']) {
                        committee[j].effectiveStake += (Number(member['effective-stake']) / 1000000000000000000);
                        committee[j].keys.push(keyData);
                        foundExisting = true;
                    }
                }

            if (!foundExisting)
                committee.push({
                    address: member['earning-account'],
                    effectiveStake: Number(member['effective-stake']) / 1000000000000000000,
                    isHarmony: member['is-harmony-slot'],
                    keys: [keyData]
                })

        }
        
        return committee;
    }

}