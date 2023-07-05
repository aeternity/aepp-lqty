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
import type { ContractCall } from './ContractCall';
import {
    ContractCallFromJSON,
    ContractCallFromJSONTyped,
    ContractCallToJSON,
} from './ContractCall';

/**
 * 
 * @export
 * @interface GetContractsCalls200Response
 */
export interface GetContractsCalls200Response {
    /**
     * 
     * @type {Array<ContractCall>}
     * @memberof GetContractsCalls200Response
     */
    data?: Array<ContractCall>;
    /**
     * 
     * @type {string}
     * @memberof GetContractsCalls200Response
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GetContractsCalls200Response
     */
    prev?: string | null;
}

/**
 * Check if a given object implements the GetContractsCalls200Response interface.
 */
export function instanceOfGetContractsCalls200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function GetContractsCalls200ResponseFromJSON(json: any): GetContractsCalls200Response {
    return GetContractsCalls200ResponseFromJSONTyped(json, false);
}

export function GetContractsCalls200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetContractsCalls200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': !exists(json, 'data') ? undefined : ((json['data'] as Array<any>).map(ContractCallFromJSON)),
        'next': !exists(json, 'next') ? undefined : json['next'],
        'prev': !exists(json, 'prev') ? undefined : json['prev'],
    };
}

export function GetContractsCalls200ResponseToJSON(value?: GetContractsCalls200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': value.data === undefined ? undefined : ((value.data as Array<any>).map(ContractCallToJSON)),
        'next': value.next,
        'prev': value.prev,
    };
}
