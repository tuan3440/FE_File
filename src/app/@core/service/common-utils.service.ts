import { Injectable, QueryList } from "@angular/core";
import { AppStorage } from "./AppStorage";
import { Route, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import {jwtDecode} from "jwt-decode";


interface TreeNode {
  id: number;
  children?: TreeNode[];
  status: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CommonUtils {
    public static hasPermission(moduleCode: string, actionCode: string) {
      let user = AppStorage.getUserToken();
      let jwt = user.access_token;
      let infoJwt: any = jwtDecode(jwt);
      let authList: string = infoJwt.auth;
      let authArray: string[] = authList.split(',');
      if (authArray.includes(moduleCode + '_' + actionCode)) {
        return true;
      }
      return false;
    }
    public static isNullOrEmpty(str: any): boolean {
        return !str || (str + '').trim() === '';
    }

    public static isRealNumber(num: any): boolean {
        if (CommonUtils.isNullOrEmpty(num)) {
          return false;
        }
        if ( num === '0' || num === 0) {
          return false;
        }
        return true;
    }

    public static logoutAction(router: Router){
        AppStorage.clear();
        router.navigate(['auth/login']);
    }
    /**
     * convertData
     */
    // public static convertData(data: any): any {
    //   if (typeof data === typeof {}) {
    //     return CommonUtils.convertDataObject(data);
    //   } else if (typeof data === typeof []) {
    //     return CommonUtils.convertDataArray(data);
    //   } else if (typeof data === typeof true) {
    //     return CommonUtils.convertBoolean(data);
    //   }
    //   return data;
    // }

      /**
     * convertDataObject
     * param data
     */
    // public static convertDataObject(data: Object): Object {
    //   if (data) {
    //     for (const key in data) {
    //       if (data[key] instanceof File) {
    //
    //       } else {
    //         data[key] = CommonUtils.convertData(data[key]);
    //       }
    //     }
    //   }
    //   return data;
    // }

    // public static convertDataArray(data: Array<any>): Array<any> {
    //   if (data && data.length > 0) {
    //     for (const i in data) {
    //       data[i] = CommonUtils.convertData(data[i]);
    //     }
    //   }
    //   return data;
    // }
    public static convertBoolean(value: Boolean): number {
      return value ? 1 : 0;
    }

    public static getListYear(fromYear?: number, toYear?: number) {
      const listYear: any[] = [];
      if (fromYear && toYear) {
        for (let i = fromYear ; i <= toYear ; i++ ) {
          const obj = {
            year: i
          };
          listYear.push(obj);
        }
      }
      return listYear;
    }

    public static isValidForm(form: any): boolean {
      setTimeout(() => {
        this.markAsTouched(form);
      }, 200);

      if (form.invalid) {
        setTimeout(() => {
          CommonUtils.scrollToSmoothly('.errorMessageDiv.show');
        }, 200);
      }
      return !form.invalid;
    }

    public static markAsTouched(form: any) {
      if (form instanceof FormGroup) {
        CommonUtils.isValidFormGroup(form);
      } else if (form instanceof FormArray) {
        CommonUtils.isValidFormArray(form);
      } else if (form instanceof FormControl) {
        form.markAsTouched({ onlySelf: true });
        if (form.invalid) {
          console.warn('Validate error field:', form);
        }
      }
    }


    public static isValidFormGroup(form: FormGroup) {
      Object.keys(form.controls).forEach(key => {
        // CommonUtils.markAsTouched(form.get(key));
        form.get(key)?.markAsDirty();
        form.get(key)?.markAllAsTouched();
        form.get(key)?.updateValueAndValidity();

      });
    }

    public static isValidFormArray(form: FormArray) {
      for (const i in form.controls) {
        CommonUtils.markAsTouched(form.controls[i]); // neu form đang bị ẩn thì không cần validate
      }
    }

    public static scrollToSmoothly(querySelectorAll: any, time?: any) {
      const elements = document.querySelectorAll(querySelectorAll);
      if (!elements) {
        return;
      }
      const first = elements[0];
      if (!first) {
        return;
      }
      const position = CommonUtils.offset(first);
      if (isNaN(position.top)) {
        console.warn('Position must be a number');
        return;
      }
      if (position.top < 0) {
        console.warn('Position can not be negative');
        return;
      }
      let top = position.top - 100;
      const currentPos = window.scrollY || window.screenTop;
      if (currentPos > position.top) {
        top = position.top + 100;
      }
      try {
        window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, top);
      }
    }

    public static offset(el: any): any {
      const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }

    /**
     *
     * @param arr array of id in number or string
     * @param items array of item's id to check
     * @returns true if all ids in 'items' are included in 'arr'
     */
    public checkAllBelongToArray(arr:( number | string) [], items:( number | string)[]): boolean{
      let output = true;
      items.forEach(i => {
        if(arr.indexOf(i) < 0){
          output = false;
        }
      });
      return output;
    }

    /**
     * find an item in TreeNode array
     * @param arr TreeNode array
     * @param id item's id to find
     * @returns Type of TreeNode | undefined
     */
    public findInTree(arr: any[], id: number){
      let found = arr.find(i => i.id == id);
      if(found){
        return found;
      }
      else {
        arr.forEach(a => {
          if(a.children && !found){
            found = this.findInTree(a.children, id);
          }
        })
      }
      return found;
    }

    // public trimOnBlur(form: FormGroup, controlName: string, isNumber?: boolean){
    //   if(form.get(controlName)){
    //     let value = form.get(controlName)!.value;
    //     if(typeof(value) == 'string') form.get(controlName)!.setValue(value.trim())
    //     // auto trim value begin by zero in case number
    //     if(isNumber) form.get(controlName)!.setValue(form.get(controlName)!.value.replace(/^0+/, ''))
    //   }
    // }

    //#region validate utils
    /**
     * check FormGroup is valid or not and focus on first invalid element (input or select)
     * @param form FormGroup instance
     * @param inputs input that uses directive vts-input AND ONLY vts-input
     * @param selects select that uses vts-select
     * @returns true if form is valid; otherwise false
     */
    // public checkValidate(form: FormGroup, inputs: QueryList<VtsInputDirective>, selects?: QueryList<VtsSelectComponent>){
    //
    //   if(form.invalid){
    //     const keys = Object.keys(form.controls);
    //     let first = '';
    //     keys.forEach(key => {
    //       if(form.get(key)?.invalid && !first){
    //         first = key;
    //       }
    //       // to change border color if this field is invalid
    //       form.get(key)?.markAsDirty();
    //       form.get(key)?.markAllAsTouched();
    //       form.get(key)?.updateValueAndValidity();
    //     });
    //     let firstInvalidELe = (inputs.find(input => input.ngControl.name == first)?.ngControl.valueAccessor as any);
    //     // input invalid
    //     if(firstInvalidELe){
    //       firstInvalidELe._elementRef.nativeElement.focus();
    //       return false;
    //     }
    //     else {
    //       // select invalid
    //       if(selects){
    //         const selectInvalidIndex = this.validateAllSelects(first, selects);
    //         if(selectInvalidIndex >= 0) {
    //           selects.get(selectInvalidIndex)?.focus();
    //           return false;
    //         }
    //       }
    //       // tree menu invalid
    //       // => only show message
    //       return false;
    //     }
    //
    //   }
    //   else return true;
    // }

    /**
     * return index of first invalid select field
     */
    // public validateAllSelects(invalidKey: string, selects: QueryList<VtsSelectComponent>): number{
    //   let output = -1;
    //   try{
    //     selects.forEach((sel, ind) => {
    //       const nativeElement = <HTMLElement>(sel as any).elementRef.nativeElement;
    //       const controlName = nativeElement.attributes['formcontrolname'].nodeValue;
    //       if(controlName == invalidKey){
    //         output = ind;
    //       }
    //     });
    //   }
    //   catch(err: any){
    //     throw new Error(err.toString());
    //   }
    //   return output;
    // }

    /**
     * focus on first field in the form
     * @param form FormGroup instance
     * @param inputs input that uses directive vts-input AND ONLY vts-input
     * @param selects select that uses vts-select
     */
    // public focusFirstField(form: FormGroup, inputs: QueryList<VtsInputDirective>, selects?: QueryList<VtsSelectComponent>){
    //   const keys = Object.keys(form.controls);
    //   let first = keys[0];
    //   let firstInvalidELe = (inputs.find(input => input.ngControl.name == first)?.ngControl.valueAccessor as any);
    //   if(firstInvalidELe){
    //     firstInvalidELe._elementRef.nativeElement.focus();
    //   }
    //   else {
    //     // select focus
    //     if(selects && selects.length > 0) {
    //       selects.get(0)?.focus();
    //     }
    //   }
    // }

    /**
     * focus to invalid field, when receiving error code from backend
     * translate if needed
     */
    // public focusToInvalidField(form: FormGroup, inputs: QueryList<VtsInputDirective>, msg: string, translate?: TranslateService, toast?: VtsToastService){
    //   const parts = msg.split('.'); // "error.<invalidField>.<errorCode>"
    //   if(parts.length > 1){
    //     const errorField = parts[1];
    //     form.get(errorField)?.setErrors({
    //       codeExist: true
    //     });
    //     let invalidELe = (inputs.find(input => input.ngControl.name == errorField)?.ngControl.valueAccessor as any);
    //     if(invalidELe){
    //       invalidELe._elementRef.nativeElement.focus();
    //     }
    //     if(translate && toast){
    //       const message = translate.instant(msg);
    //       toast.error("", message);
    //     }
    //   }
    // }

    //#endregion

    /**
     * get object authenticationDTO
     */
    // getObjAuthenticationDTO(){
    //   const user:any = AppStorage.getUserToken().userInfo;
    //   const allowProps = [
    //     'id',
    //     'userName',
    //     'fullName',
    //     'email',
    //     'active',
    //     'phoneNumber',
    //     'jobTitle',
    //     'appCode',
    //     'orgCode',
    //     'roles',
    //     'org',
    //     'context',
    //   ];
    //   const keys: string[] = Object.keys(user);
    //   keys.forEach(k => {
    //     if(user[k] !== undefined && allowProps.indexOf(k) < 0){
    //       delete user[k];
    //     }
    //   });
    //   user.isActivate = user.active;
    //   user.context = {
    //     "headers":{
    //       "client":"web"
    //     },
    //     "body": {
    //         "id": "6",
    //         "orgCode": "VTS"
    //     }
    //   };
    //   user.orgCode = user.org ? user.org.orgCode : '';
    //   user.appCode = "WEB_APPs";
    //   user['roles'] = (user.roles as UserRole[])!.map(r => r.roleCode!)
    //   delete user.org;
    //   delete user.active;
    //   return user;
    // }
    //
    // processResponsePermission(scopes: SCOPE_TYPE_DEFAULT[], res: boolean[]): {[key: string]: boolean}{
    //   let output = {};
    //   scopes.forEach((scope, ind) => {
    //     output[scope] = res[ind];
    //   })
    //   return output;
    // }

    /**
     * mapping from menus received from server to menu items prolayout sider
     * @param origin response resource menus from server
     * @returns menu items for prolayout sider
     */
    // public mappingResourceToMenuItem(origin: Partial<ResourceTreeNode>[]): VtsMenuItemProLayout[]{
    //   let output: VtsMenuItemProLayout[] = [];
    //   // sort origin
    //   origin.sort((a,b) => a.resourceOrder! - b.resourceOrder!)
    //   origin.forEach(re => {
    //     let current: VtsMenuItemProLayout = {
    //       title: re.resourceName ? re.resourceName: ''
    //     }
    //     if(re.children && re.children.length > 0){
    //       current.children = this.mappingResourceToMenuItem(re.children);
    //     }
    //     else {
    //       current.url = re.url;
    //     }
    //     output.push(current);
    //   })
    //   return output;
    // }

    /**
     * get type ui text from code
     * @param typeUiCode typeUi code (0,1,2)
     * @returns Menu cap 1, Menu con, Nut hay chuc nang
     */
    // getTypeUIInText(typeUiCode: string){
    //   switch(typeUiCode){
    //     case TypeUIs.MENU_CAP_1: {
    //       return 'authorizationPolicy.resources_management.type.menu-level-1'
    //     }
    //     case TypeUIs.MENU_CON: {
    //       return 'authorizationPolicy.resources_management.type.menu-mini'
    //     }
    //     case TypeUIs.NUT_CHUC_NANG: {
    //       return 'authorizationPolicy.resources_management.type.button-or-function'
    //     }
    //     default: {
    //       return 'not_found'
    //     }
    //   }
    // }

    // getValuesOfSetInArray<T>(set: Set<T>){
    //   const valueArr: T[] = [];
    //   set.forEach(value => {
    //     valueArr.push(value);
    //   })
    //   return valueArr;
    // }
    //
    // isEllipsisOn(tdValue: HTMLElement){
    //   if(tdValue){
    //     const ele = tdValue;
    //     if(ele.offsetWidth < ele.scrollWidth){
    //       return true;
    //     }
    //     else {
    //       return false;
    //     }
    //   }
    // }

}
