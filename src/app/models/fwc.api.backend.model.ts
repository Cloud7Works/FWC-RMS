import { CreateTransmittalMapper, DepartmentDocRecordMapper, RecentTransmittalMapper } from './mapping.model';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError,delay,map, tap } from 'rxjs/operators';
import { APINotificationResult, APISignature, Progress, Source, Status } from './api.notification.model';
import { TransmittalSearchRequest } from './transmittalSearchRequest';
import { UpdateTransmittalRequest } from './updateTransmittalRequest';
import { CreateTransmittalDetailRequest } from './createTransmittalDetailRequest';
import { TransmittalSearchResponse } from './transmittalSearchResponse';
import { TransmittalResponse } from './transmittalResponse';
import { TransmittalDetailResponse } from './transmittalDetail';
import { SearchType } from './search-type.enum';
export class FWCDataBackend implements APISignature{
    constructor(private http : HttpClient, private notify : Subject<APINotificationResult>){
    }
 
    // private readonly host = 'https://wbptnj0uqg.execute-api.us-east-1.amazonaws.com/';

    private readonly host ='https://fwcrmswebapi20201221162301.azurewebsites.net/v1';
    api : Observable<any> = of(null);
    httpOptions = {headers: new HttpHeaders({'content-type':'application/json'})};

    result(source: Source, mapper? : any){
        return this.api.pipe(
        catchError(error=> of(new Status(true,true,error,Progress.Completed))),
        map((response : any)=>{ 
            var data: any;           
            data = mapper? mapper.map(response) : response;
            if(response instanceof Status){
                this.notify.next(new APINotificationResult(source,data,null));
            }else{
                this.notify.next(new APINotificationResult(source,new Status(true,false,'200',Progress.Completed),data));
            }                  
            return data;
        }));
    }

    departmentDocumentSearch(type: SearchType, payload: TransmittalSearchRequest): Observable<TransmittalSearchResponse[]>;
    departmentDocumentSearch(type: SearchType, payload: string): Observable<TransmittalSearchResponse[]>;
    departmentDocumentSearch(type: any, payload: any) {
        console.log(payload);
        this.notify.next(new APINotificationResult(Source.TransmittalSearch,new Status(false,false,'',Progress.InProgress),null));
        if(type==SearchType.Simple){            
            this.api = this.http.get(this.host+"/departmentDocumentSearch?keyword=" + payload,this.httpOptions);                
            // this.api = this.http.get('./../assets/data/transmittal-search.json');
        }else{
             this.api = this.http.post(this.host+"/departmentDocumentSearch",payload,this.httpOptions);                
            // this.api = this.http.get('./../assets/data/transmittal-search.json');
        }        
                        
        return this.result(Source.TransmittalSearch);
    }

    // GET : /transmittals
    public getTransmittals() : Observable<TransmittalResponse[]>{       
        this.notify.next(new APINotificationResult(Source.TransmittalSummary,new Status(false,false,'',Progress.InProgress),null));
        var path = "transmittals/?transmittalStatus=Data%20Entry";
        console.log('get recent transmittals');
        console.log(path);
        this.api = this.http.get(this.host+'/'+ path,this.httpOptions);                
        // this.api = this.http.get('./../assets/data/transmittal-summary.response.json');
        return this.result(Source.TransmittalSummary,new RecentTransmittalMapper());
    }   

    // POST : /transmittals
    public createTransmittal(transmittalDate : string, transmittalStatus : string) : Observable<TransmittalResponse>{        
        this.notify.next(new APINotificationResult(Source.TransmittalCreation,new Status(false,false,'',Progress.InProgress),null));
        var payload = {
        "transmittalDate": transmittalDate,
        "transmittalStatus": transmittalStatus
        }        
        console.log('createTransmittal');
        console.log(payload);
        this.api = this.http.post(this.host+'/transmittals',payload,this.httpOptions);
        // this.api = this.http.get('./../assets/data/create-transmittal.response.json');
        return this.result(Source.TransmittalCreation,new CreateTransmittalMapper());
    }

     // PATCH : /transmittals/{transmittalNumber} Update a Transmittal record
     public updateTransmittal(transmittalNumber : number ,payload : UpdateTransmittalRequest) :  Observable<TransmittalResponse>{      
        this.notify.next(new APINotificationResult(Source.TransmittalUpdate,new Status(false,false,'',Progress.InProgress),null));  
        var path = "transmittals/"+transmittalNumber;
        console.log('updateTransmittal');
        console.log(payload);
        console.log(path);
        this.api = this.http.patch(this.host + "/" + path ,payload,this.httpOptions);
        // this.api=of({
        //     "transmittalNumber": 0,
        //     "transmittalDate": "2020-12-21",
        //     "transmittalTotalCount": 0,
        //     "transmittalTotal": 0,
        //     "transmittalStatus": "string"
        //   });
        return this.result(Source.TransmittalUpdate);
    }

    //DELETE /transmittals/{transmittalNumber}/departmentDocuments/{departmentDocumentsNumber}
    public deleteDepartmentDocRecord(transmittalNumber: number, departmentDocumentNumber:number) : Observable<any>{
        this.notify.next(new APINotificationResult(Source.DeleteDepartmentDocument,new Status(false,false,'',Progress.InProgress),null));  
        var path = "transmittals/"+transmittalNumber+"/departmentDocuments/"+departmentDocumentNumber;
        console.log('delete');        
        console.log(path);
        this.api = this.http.delete(path,this.httpOptions);
        return this.result(Source.DeleteDepartmentDocument);
    }

    // POST : /transmittals/{transmittalNumber}/departmentDocuments
    public createDepartmentDocumentNumber(transmittalNumber : number, payload : CreateTransmittalDetailRequest) : Observable<TransmittalDetailResponse>{                       
        this.notify.next(new APINotificationResult(Source.TransmittalList,new Status(false,false,'',Progress.InProgress),null));          
        var path = transmittalNumber + "/departmentDocuments";
        console.log('createDepartmentDocumentNumber');
        console.log(payload);
        console.log(path);
        this.api = this.http.post(this.host+ "/transmittals/" + path ,payload, this.httpOptions);
        // this.api = this.http.get('./../assets/data/ddn.response.json');
        return this.result(Source.TransmittalList,new DepartmentDocRecordMapper());
    }
    
}