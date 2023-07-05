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
/**
 * AEx141 Transfer
 * @export
 * @interface Aex141TransferEvent
 */
export interface Aex141TransferEvent {
    /**
     * 
     * @type {string}
     * @memberof Aex141TransferEvent
     */
    blockHeight?: string;
    /**
     * 
     * @type {string}
     * @memberof Aex141TransferEvent
     */
    contractId?: string;
    /**
     * 
     * @type {number}
     * @memberof Aex141TransferEvent
     */
    logIdx?: number;
    /**
     * 
     * @type {number}
     * @memberof Aex141TransferEvent
     */
    microIndex?: number;
    /**
     * 
     * @type {number}
     * @memberof Aex141TransferEvent
     */
    microTime?: number;
    /**
     * 
     * @type {string}
     * @memberof Aex141TransferEvent
     */
    recipientId?: string;
    /**
     * 
     * @type {string}
     * @memberof Aex141TransferEvent
     */
    senderId?: string;
    /**
     * 
     * @type {number}
     * @memberof Aex141TransferEvent
     */
    tokenId?: number;
    /**
     * 
     * @type {string}
     * @memberof Aex141TransferEvent
     */
    txHash?: string;
}

/**
 * Check if a given object implements the Aex141TransferEvent interface.
 */
export function instanceOfAex141TransferEvent(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function Aex141TransferEventFromJSON(json: any): Aex141TransferEvent {
    return Aex141TransferEventFromJSONTyped(json, false);
}

export function Aex141TransferEventFromJSONTyped(json: any, ignoreDiscriminator: boolean): Aex141TransferEvent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'blockHeight': !exists(json, 'block_height') ? undefined : json['block_height'],
        'contractId': !exists(json, 'contract_id') ? undefined : json['contract_id'],
        'logIdx': !exists(json, 'log_idx') ? undefined : json['log_idx'],
        'microIndex': !exists(json, 'micro_index') ? undefined : json['micro_index'],
        'microTime': !exists(json, 'micro_time') ? undefined : json['micro_time'],
        'recipientId': !exists(json, 'recipient_id') ? undefined : json['recipient_id'],
        'senderId': !exists(json, 'sender_id') ? undefined : json['sender_id'],
        'tokenId': !exists(json, 'token_id') ? undefined : json['token_id'],
        'txHash': !exists(json, 'tx_hash') ? undefined : json['tx_hash'],
    };
}

export function Aex141TransferEventToJSON(value?: Aex141TransferEvent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'block_height': value.blockHeight,
        'contract_id': value.contractId,
        'log_idx': value.logIdx,
        'micro_index': value.microIndex,
        'micro_time': value.microTime,
        'recipient_id': value.recipientId,
        'sender_id': value.senderId,
        'token_id': value.tokenId,
        'tx_hash': value.txHash,
    };
}

