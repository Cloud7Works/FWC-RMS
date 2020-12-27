import { tap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as configuration from '../config/config.json';

export class AppConfiguration{

    constructor(){}
    config = configuration;
    initialiaze(){
        return new Promise(async (resolve,reject)=>{
            of(configuration).pipe(tap((data:any)=>{
                this.config=data.default;
            }),map(()=>true)).subscribe((data)=>resolve(data)); 
        })
    }  
}
