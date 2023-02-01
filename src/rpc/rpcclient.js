import { params } from "../params"
import { Shard } from "../shard/shard";
import { validatorNames } from "./validatornames";

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

    //console.log(response);
    if (response.ok) {
        response.json().then(result => {
            //console.log(result);
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

export const getValidatorName = async (address, setName) => {
    if (!address)
        return '';

    const result = await getValidatorInformation(address);
    //console.log('Got v info')
    //console.log(result)
    setName(result.result.validator.name)

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

    //console.log(response);
    if (response.ok) {
        const result = await response.json();
        return result;
    }
}

export const setValidatorNames = async (validators, setData) => {
    if (!validators) return;
    for (let i = 0; i < validators.length; i++)
        if (validators[i].address) {
            const val = validatorNames.filter((validator) => validator.address === validators[i].address);
            if (val.length > 0)
                validators[i].name = val[0].name
            else {
                const result = await getValidatorInformation(validators[i].address);
                validators[i].name = result.result.validator.name;
                validatorNames.push({
                    address: validators[i].address,
                    name: result.result.validator.name,
                })
            }
        }
    setData(validators);
}

