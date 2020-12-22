import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(suffix : string) : ValidatorFn{
    return(control:AbstractControl):ValidationErrors | null =>{  
        var val = (control.value as string);
        if(val.includes('@')){
            if(!val.split('@')[1].includes(suffix))
            {
                return {'invalidEmailFormat':true};
            }
        }     
      return null;
    }
  }
  
  const hasValue = (val:string)=>{
    return val && val!=="";
  }
