import { Injectable } from "@angular/core";
import { CommonUtils } from "./common-utils.service";
import { CryptoService } from "./crypto.service";
import {UserToken} from "../model/user-token.model";

@Injectable({
    providedIn: 'root'
})
class StorageData {
    userToken?: UserToken;
    navState?: boolean;
    navFlipState?: boolean;
    searchState: any;
    listLang: any;
    listMarket: any;
    currentUrl: any;
    intro: any;
}

export class AppStorage{
    private static storage = localStorage;
    private static instanceName = '_AppStorage';
    /**
     * init
     */
    public static init(): void {
    }
    /**
     * isExprited
     */
    public static isExprited(): boolean {
        return false;
    }
      /**
     * clear
     */
    public static clear(): void {
        this.storage.removeItem(this.instanceName);
    }
    /**
     * storedData
     */
    public static storedData(): any {
        const storedData = this.storage.getItem(this.instanceName);
        if(storedData){
            if (CommonUtils.isNullOrEmpty(storedData)) {
            return null;
            }
            return CryptoService.decr(storedData);
        }
    }
    /**
     * get
     */
    public static get(key: string): any {
        if (this.isExprited()) {
        return null;
        }
        const storedData = this.storedData();
        if (storedData == null) {
        return null;
        }
        return storedData[key];
    }
    /**
     * get
     */
    public static set(key: string, val: any): any {
        let storedData = this.storedData();
            if (storedData == null) {
            storedData = new StorageData();
            }
            storedData[key] = val;
            this.storage.setItem(this.instanceName, CryptoService.encr(storedData)!);
    }

    /**
     * getUserToken
     */
    public static getUserToken(): UserToken {
        return this.get('userToken');
    }
    /**
     * setUserToken
     */
    public static setUserToken(userToken: UserToken) {
        return this.set('userToken', userToken);
    }

    /**
    * config for login
    */
    public static getLoginTransactionId(): string {
        return this.get('transactionId');
    }
    public static setLoginTransactionId(transactionId: string): string {
        return this.set('transactionId', transactionId);
    }
}
