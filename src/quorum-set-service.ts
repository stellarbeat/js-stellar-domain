import {QuorumSet} from "./quorum-set";
import {Node} from "./node";

export class QuorumSetService {
    public quorumSetCanReachThreshold(owner:Node, quorumSet:QuorumSet, failingNodes:Array<Node>, publicKeysToNodesMap:Map<string, Node>) { //
        let counter = quorumSet.validators.filter(validator => {
            if (!publicKeysToNodesMap.has(validator)) {
                return false;
            }

            if(failingNodes.includes(publicKeysToNodesMap.get(validator))){
                return false;
            }

            if(owner.publicKey === validator) {
                return false;
            }

            return publicKeysToNodesMap.get(validator).active;
        }).length;

        quorumSet.innerQuorumSets.forEach(innerQS => {
            if (this.quorumSetCanReachThreshold(owner, innerQS, failingNodes, publicKeysToNodesMap)) {
                counter++;
            }
        });

        return counter >= quorumSet.threshold;
    }
}