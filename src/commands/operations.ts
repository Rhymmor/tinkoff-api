import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { joi, ObjectKeysSchema } from "../lib/validation";

export namespace OperationsCommand {
    export interface IRequestQuery extends ICommonQuery {
        start: string | number;  // seconds
        end: string | number;    // seconds
    }
    export interface IResponse extends ICommonResponse {
        payload: IPayload;
    }

    type IPayload = IOperation[];

    export interface IOperation {
        id: string;
        description: string;
        operationTime: ITimestamp;
        amount: IAmount;
        payment: IPayment;
        account: string;
        card: string;
        group: string;
        cashback: number;
        status: OperationStatus | string;
        type: string;
        isExternalCard: boolean;
        subcategory: string;
        mcc: number;
        partnerType: string;
        category: ICategory;
        locations: ILocation[];
        loyaltyBonus: ILoyaltyBonus[];
        spendingCategory: ISpendingCategory;
        compensation: string;
        merchant: IMerchant;
        brand?: IBrand;
    }

    export enum OperationStatus {
        OK = 'OK'
    }

    interface IBrand {
        name: string;
        baseTextColor: string;
        logo: string;
        id: string;
        roundedLogo: boolean;
        link: string;
        baseColor: string;
        logoFile: string;
    }

    interface IMerchant {
        name: string;
        region: IRegion;
    }

    interface IRegion {
        country: string;
        city: string;
        address: string;
        zip: string;
    }

    interface ISpendingCategory extends ICategory {
        icon: string;
        parentId: string;
    }

    interface ILoyaltyBonus {
        loyaltyType: string;
        status: string;
        amount: ILoyaltyAmount;
    }

    interface ILoyaltyAmount {
        value: number;
        loyaltyProgramId: string;
        loyalty: string;
        name: string;
        loyaltySteps: number;
        loyaltyPointsId: number;
        loyaltyPointsName: string;
        loyaltyImagine: boolean;
        partialCompensation: boolean;
    }

    interface ILocation {
        latitude: number;
        longitude: number;
    }

    interface ICategory {
        id: string;
        name: string;
    }

    interface IPayment {
        paymentId: string;
        paymentType: string;
        providerId: string;
        cardNumber: string;
        bankAccountId: string;
    }

    interface ITimestamp {
        milliseconds: number;
    }

    interface IAmount {
        currency: ICurrency;
        value: number;
    }

    interface ICurrency {
        code: number;
        name: string;
    }

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse,
        payload: joi.array().items(joi.object().optional()).required()
    };

    export const url: Readonly<string> = '/operations';
    export const requiredSession: Readonly<boolean> = true;
    export const method: Readonly<string> = 'GET';
}