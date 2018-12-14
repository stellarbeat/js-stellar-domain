import {Node, QuorumSet} from "./index";

function getThresholdPercentage(quorumSet:QuorumSet):number {
    return Math.round(
        (quorumSet.threshold / (quorumSet.validators.length + quorumSet.innerQuorumSets.length)) * 100
    );
}

function getValidatorsStringPart(quorumSet: QuorumSet, publicKeysToNodesMap: Map<string, Node>) {
    let validatorsStringPart = 'VALIDATORS=[\n';
    quorumSet.validators.forEach((validator, index) => {
        validatorsStringPart += '    "'
            + validator + ' '
            + publicKeysToNodesMap.get(validator).name + '"';
        if (index !== quorumSet.validators.length - 1) {
            validatorsStringPart += ',';
        }
        validatorsStringPart += '\n';
    });
    return validatorsStringPart;
}

export function generateTomlString(quorumSet:QuorumSet, publicKeysToNodesMap:Map<string, Node>, prefix:string = ""):string {
    let tomlString = '[QUORUM_SET' + prefix + ']\n';
    tomlString += 'THRESHOLD_PERCENT=' + getThresholdPercentage(quorumSet) + '\n';
    tomlString += getValidatorsStringPart(quorumSet, publicKeysToNodesMap);
    tomlString += ']\n';

    for(let i = 0; i<quorumSet.innerQuorumSets.length; i++) {
        let newPrefix = prefix + '.' + (i + 1);
        tomlString += generateTomlString(quorumSet.innerQuorumSets[i], publicKeysToNodesMap, newPrefix);
    }

    return tomlString;
}