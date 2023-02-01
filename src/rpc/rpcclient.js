import { params } from "../params"
import { Shard } from "../shard/shard";

export const getSuperCommitties = async (setShardData) => {
    const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "hmyv2_getSuperCommittees",
        params: []
    }
    const response = await fetch(params.rpcurl, {
        method: 'POST',
        headers: {

            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        response.json().then(result => {
            processShardData(result.result, setShardData)
        });
    }

}

const processShardData = (data, setShardData) => {
    //console.log('processing shard data')
    const shard0 = new Shard(data.current['quorum-deciders']['shard-0'], 0);
    const shard1 = new Shard(data.current['quorum-deciders']['shard-1'], 1);
    const shard2 = new Shard(data.current['quorum-deciders']['shard-2'], 2);
    const shard3 = new Shard(data.current['quorum-deciders']['shard-3'], 3);
    //console.log(shard0);
    setShardData([shard0, shard1, shard2, shard3]);
}

const getValidatorInformation = async (address) => {
    const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "hmyv2_getValidatorInformation",
        params: [address]
    }

    const response = await fetch(params.rpcurl, {
        method: 'POST',
        headers: {

            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const result = await response.json();
        return result;
    }
}

export const updateValidatorNames = async (validators, setUpdate, validatorNames, setValidatorNames) => {
    if (!validators)
        return;

    if (!validatorNames)
        return;

    let vNames = validatorNames;
    let name = '';

    for (let i = 0; i < validators.length; i++)
        if (validators[i].address) {
            name = vNames[validators[i].address];
            validators[i].name = name
            if (!name) {
                const result = await getValidatorInformation(validators[i].address);
                name = result.result.validator.name;
                console.log('Got name ', name)
                vNames[validators[i].address] = name
                setValidatorNames(null)
                setValidatorNames(vNames)
                setUpdate(true);
            }
        }
}

