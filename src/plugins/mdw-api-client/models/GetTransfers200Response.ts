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
import type { Transfer } from './Transfer';
import {
    TransferFromJSON,
    TransferFromJSONTyped,
    TransferToJSON,
} from './Transfer';

/**
 * 
 * @export
 * @interface GetTransfers200Response
 */
export interface GetTransfers200Response {
    /**
     * 
     * @type {Array<Transfer>}
     * @memberof GetTransfers200Response
     */
    data?: Array<Transfer>;
    /**
     * 
     * @type {string}
     * @memberof GetTransfers200Response
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GetTransfers200Response
     */
    prev?: string | null;
}

/**
 * Check if a given object implements the GetTransfers200Response interface.
 */
export function instanceOfGetTransfers200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function GetTransfers200ResponseFromJSON(json: any): GetTransfers200Response {
    return GetTransfers200ResponseFromJSONTyped(json, false);
}

export function GetTransfers200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetTransfers200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': !exists(json, 'data') ? undefined : ((json['data'] as Array<any>).map(TransferFromJSON)),
        'next': !exists(json, 'next') ? undefined : json['next'],
        'prev': !exists(json, 'prev') ? undefined : json['prev'],
    };
}

export function GetTransfers200ResponseToJSON(value?: GetTransfers200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': value.data === undefined ? undefined : ((value.data as Array<any>).map(TransferToJSON)),
        'next': value.next,
        'prev': value.prev,
    };
}

