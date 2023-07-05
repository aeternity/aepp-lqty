/* tslint:disable */
/* eslint-disable */
/**
 * Aeternity Middleware
 * API for [Aeternity Middleware](https://github.com/aeternity/ae_mdw)
 *
 * The version of the OpenAPI document: 1.51.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { ActivityPayload } from './ActivityPayload';
import {
    ActivityPayloadFromJSON,
    ActivityPayloadFromJSONTyped,
    ActivityPayloadToJSON,
} from './ActivityPayload';

/**
 * Activity related to an account
 * @export
 * @interface Activity
 */
export interface Activity {
    /**
     * The block hash
     * @type {string}
     * @memberof Activity
     */
    blockHash: string;
    /**
     * The block height
     * @type {number}
     * @memberof Activity
     */
    height: number;
    /**
     * 
     * @type {ActivityPayload}
     * @memberof Activity
     */
    payload: ActivityPayload;
    /**
     * The event type
     * @type {string}
     * @memberof Activity
     */
    type: ActivityTypeEnum;
}


/**
 * @export
 */
export const ActivityTypeEnum = {
    SpendTxEvent: 'SpendTxEvent',
    OracleRegisterTxEvent: 'OracleRegisterTxEvent',
    OracleExtendTxEvent: 'OracleExtendTxEvent',
    OracleQueryTxEvent: 'OracleQueryTxEvent',
    OracleResponseTxEvent: 'OracleResponseTxEvent',
    NamePreclaimTxEvent: 'NamePreclaimTxEvent',
    NameClaimTxEvent: 'NameClaimTxEvent',
    NameTransferTxEvent: 'NameTransferTxEvent',
    NameUpdateTxEvent: 'NameUpdateTxEvent',
    NameRevokeTxEvent: 'NameRevokeTxEvent',
    ContractCreateTxEvent: 'ContractCreateTxEvent',
    ContractCallTxEvent: 'ContractCallTxEvent',
    GaAttachTxEvent: 'GaAttachTxEvent',
    GaMetaTxEvent: 'GaMetaTxEvent',
    ChannelCreateTxEvent: 'ChannelCreateTxEvent',
    ChannelDepositTxEvent: 'ChannelDepositTxEvent',
    ChannelWithdrawTxEvent: 'ChannelWithdrawTxEvent',
    ChannelForceProgressTxEvent: 'ChannelForceProgressTxEvent',
    ChannelCloseMutualTxEvent: 'ChannelCloseMutualTxEvent',
    ChannelCloseSoloTxEvent: 'ChannelCloseSoloTxEvent',
    ChannelSlashTxEvent: 'ChannelSlashTxEvent',
    ChannelSettleTxEvent: 'ChannelSettleTxEvent',
    ChannelSnapshotSoloTxEvent: 'ChannelSnapshotSoloTxEvent',
    ChannelSetDelegatesTxEvent: 'ChannelSetDelegatesTxEvent',
    ChannelOffchainTxEvent: 'ChannelOffchainTxEvent',
    ChannelClientReconnectTxEvent: 'ChannelClientReconnectTxEvent',
    PayingForTxEvent: 'PayingForTxEvent'
} as const;
export type ActivityTypeEnum = typeof ActivityTypeEnum[keyof typeof ActivityTypeEnum];


/**
 * Check if a given object implements the Activity interface.
 */
export function instanceOfActivity(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "blockHash" in value;
    isInstance = isInstance && "height" in value;
    isInstance = isInstance && "payload" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function ActivityFromJSON(json: any): Activity {
    return ActivityFromJSONTyped(json, false);
}

export function ActivityFromJSONTyped(json: any, ignoreDiscriminator: boolean): Activity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'blockHash': json['block_hash'],
        'height': json['height'],
        'payload': ActivityPayloadFromJSON(json['payload']),
        'type': json['type'],
    };
}

export function ActivityToJSON(value?: Activity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'block_hash': value.blockHash,
        'height': value.height,
        'payload': ActivityPayloadToJSON(value.payload),
        'type': value.type,
    };
}
