import { TransmittalDetailModel } from './transmittal-detail.model';
import { CreateTransmittalMapper, DepartmentDocRecordMapper, RecentTransmittalMapper, UpdateDepartmentDocRecordMapper } from './mapping.model';
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

    result(source: Source, mapper? : any, notificationMessage? : {type:'CRUD',operation:any}){
        return this.api.pipe(
        catchError(error=> of(new Status(true,true,{type : 'CRUD', operation:'Something went wrong'},Progress.Completed))),
        map((response : any)=>{ 
            var data: any;           
            data = mapper && !(response instanceof Status)? mapper.map(response) : response;
            if(response instanceof Status){
                this.notify.next(new APINotificationResult(source,data,null));
            }else{
                this.notify.next(new APINotificationResult(source,
                                 new Status(true,false,notificationMessage?notificationMessage:'OK',Progress.Completed),data));
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
        this.api = this.http.post(this.host+'/transmittals',payload,this.httpOptions);
        // this.api = this.http.get('./../assets/data/create-transmittal.response.json');
        return this.result(Source.TransmittalCreation,new CreateTransmittalMapper(),{type:'CRUD',operation:'Transmittal Successfuly Created'});
    }

     // PATCH : /transmittals/{transmittalNumber} Update a Transmittal record
     public updateTransmittal(transmittalNumber : number ,payload : UpdateTransmittalRequest) :  Observable<TransmittalResponse>{      
        this.notify.next(new APINotificationResult(Source.TransmittalUpdate,new Status(false,false,'',Progress.InProgress),null));  
        var path = "transmittals/"+transmittalNumber;       
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
        this.api = this.http.delete(this.host + '/' +path,this.httpOptions);
        return this.result(Source.DeleteDepartmentDocument,null,{type:'CRUD',operation:'Department Document Record Successfuly Deleted'});
    }


    // PATCH : /transmittals/{transmittalNumber}/departmentDocuments/{departmentDocumentsNumber}
    public updateDeptDocRecord(transmittalNumber : number,deptDocNumber:number ,payload : CreateTransmittalDetailRequest,refRecord:TransmittalDetailModel) :  Observable<TransmittalDetailModel>{      
        this.notify.next(new APINotificationResult(Source.UpdateDepartmentDocumentRecord,new Status(false,false,'',Progress.InProgress),null));  
        var path = "transmittals/"+transmittalNumber+'/departmentDocuments/'+deptDocNumber;      
        this.api = this.http.patch(this.host + "/" + path ,payload,this.httpOptions);
     
        return this.result(Source.UpdateDepartmentDocumentRecord,
            new UpdateDepartmentDocRecordMapper(refRecord),{type:'CRUD',operation:'Department Document Record Successfuly Updated'} );
    }

    // GET : /transmittals/{transmittalNumber}/departmentDocuments
    public getDeptDocRecord(transmittalNumber : number) :  Observable<TransmittalDetailModel>{      
        this.notify.next(new APINotificationResult(Source.TransmittalList,new Status(false,false,'',Progress.InProgress),null));  
        var path = "transmittals/"+transmittalNumber+'/departmentDocuments';
        console.log('updateTransmittal');            
        console.log(path);
        this.api = this.http.get(this.host + "/" + path ,this.httpOptions);
        
        return this.result(Source.TransmittalList,new DepartmentDocRecordMapper());
    }


    // POST : /transmittals/{transmittalNumber}/departmentDocuments
    public createDepartmentDocumentNumber(transmittalNumber : number, payload : CreateTransmittalDetailRequest) : Observable<TransmittalDetailModel>{                       
        this.notify.next(new APINotificationResult(Source.TransmittalList,new Status(false,false,'',Progress.InProgress),null));          
        var path = transmittalNumber + "/departmentDocuments";        
        this.api = this.http.post(this.host+ "/transmittals/" + path ,payload, this.httpOptions);
        // this.api = this.http.get('./../assets/data/ddn.response.json');
        return this.result(Source.TransmittalList,new DepartmentDocRecordMapper(),{type:'CRUD',operation:'Department Document Record Successfuly Saved'});
    }
    
}