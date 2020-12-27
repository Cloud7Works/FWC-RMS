import { TransmittalDetailModel } from './transmittal-detail.model';
import { CreateTransmittalMapper, DepartmentDocRecordMapper, RecentTransmittalMapper, UpdateDepartmentDocRecordMapper } from './mapping.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { APINotificationResult, APISignature, Progress, Source, Status } from './api.notification.model';
import { TransmittalSearchRequest } from './transmittalSearchRequest';
import { UpdateTransmittalRequest } from './updateTransmittalRequest';
import { CreateTransmittalDetailRequest } from './createTransmittalDetailRequest';
import { TransmittalSearchResponse } from './transmittalSearchResponse';
import { TransmittalResponse } from './transmittalResponse';
import { SearchType } from './search-type.enum';
import { ConfigurationService } from '../services/configuration.service';
export class FWCDataBackend implements APISignature{
    constructor(private http : HttpClient, private notify : Subject<APINotificationResult>,private configData : ConfigurationService){        
    }
     
    private  config = this.configData.config;

    api : Observable<any> = of(null);
    httpOptions = {headers: new HttpHeaders({'content-type':'application/json'})};

    result(source: Source, mapper? : any, notificationMessage? : {type:'CRUD',operation:any}){
        return this.api.pipe(
        catchError(()=> of(new Status(true,true,{type : 'CRUD', operation:'Something went wrong'},Progress.Completed))),
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
            this.api = this.http.get(this.config.host+ this.config
                                                           .endPoints
                                                           .departmentDocumentSearch
                                                           .GET
                                                           .replace('REPLACE_VALUE',payload),this.httpOptions);                      
            // this.api = this.http.get('./../assets/data/transmittal-search.json');
        }else if(type==SearchType.Advanced){
            this.api = this.http.post(this.config.host+this.config
                                                           .endPoints
                                                           .departmentDocumentSearch
                                                           .POST,payload,this.httpOptions);                  
            // this.api = this.http.get('./../assets/data/transmittal-search.json');
        }else{
            this.api = of([]);
        }
                        
        return this.result(Source.TransmittalSearch);
    }

    // GET : /transmittals
    public getTransmittals() : Observable<TransmittalResponse[]>{       
        this.notify.next(new APINotificationResult(Source.TransmittalSummary,new Status(false,false,'',Progress.InProgress),null));
        this.api = this.http.get(this.config.host+this.config
                                                        .endPoints
                                                        .transmittals.GET.replace('REPLACE_VALUE','Data%20Entry'),this.httpOptions);                          
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
        this.api = this.http.post(this.config.host+this.config
                                                        .endPoints
                                                        .transmittals.POST,payload,this.httpOptions); 
        return this.result(Source.TransmittalCreation,new CreateTransmittalMapper(),{type:'CRUD',operation:'Transmittal Successfuly Created'});
    }

     // PATCH : /transmittals/{transmittalNumber} Update a Transmittal record
     public updateTransmittal(transmittalNumber : number ,payload : UpdateTransmittalRequest) :  Observable<TransmittalResponse>{      
        this.notify.next(new APINotificationResult(Source.TransmittalUpdate,new Status(false,false,'',Progress.InProgress),null));    
        this.api = this.http.patch(this.config.host + this.config
                                                          .endPoints
                                                          .transmittals.PATCH.replace('REPLACE_VALUE',transmittalNumber.toString()) ,payload,this.httpOptions); 

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
        this.api = this.http.delete(this.config.host + this.config
            .endPoints
            .departmentDocumentRecord.DELETE.replace('TRANSMITTAL_VALUE',transmittalNumber.toString())
                                            .replace('DEPT_DOC_VALUE',departmentDocumentNumber.toString()),this.httpOptions);
        return this.result(Source.DeleteDepartmentDocument,null,{type:'CRUD',operation:'Department Document Record Successfuly Deleted'});
    }


    // PATCH : /transmittals/{transmittalNumber}/departmentDocuments/{departmentDocumentsNumber}
    public updateDeptDocRecord(transmittalNumber : number,deptDocNumber:number ,payload : CreateTransmittalDetailRequest,refRecord:TransmittalDetailModel) :  Observable<TransmittalDetailModel>{      
        this.notify.next(new APINotificationResult(Source.UpdateDepartmentDocumentRecord,new Status(false,false,'',Progress.InProgress),null));      
        this.api = this.http.patch(this.config.host + this.config
                                                          .endPoints
                                                          .departmentDocumentRecord.PATCH.replace('TRANSMITTAL_VALUE',transmittalNumber.toString())
                                                                                         .replace('DEPT_DOC_VALUE',deptDocNumber.toString()),payload,this.httpOptions);   
     
        return this.result(Source.UpdateDepartmentDocumentRecord,
            new UpdateDepartmentDocRecordMapper(refRecord),{type:'CRUD',operation:'Department Document Record Successfuly Updated'} );
    }

    // GET : /transmittals/{transmittalNumber}/departmentDocuments
    public getDeptDocRecord(transmittalNumber : number) :  Observable<TransmittalDetailModel>{      
        this.notify.next(new APINotificationResult(Source.TransmittalList,new Status(false,false,'',Progress.InProgress),null));    
        this.api = this.http.get(this.config.host + this.config
                                                        .endPoints
                                                        .departmentDocumentRecord.GET.replace('REPLACE_VALUE',transmittalNumber.toString()) ,this.httpOptions);
        return this.result(Source.TransmittalList,new DepartmentDocRecordMapper());
    }


    // POST : /transmittals/{transmittalNumber}/departmentDocuments
    public createDepartmentDocumentNumber(transmittalNumber : number, payload : CreateTransmittalDetailRequest) : Observable<TransmittalDetailModel>{                       
        this.notify.next(new APINotificationResult(Source.TransmittalList,new Status(false,false,'',Progress.InProgress),null));          
        this.api = this.http.post(this.config.host+ this.config
                                                        .endPoints
                                                        .departmentDocumentRecord.POST.replace('REPLACE_VALUE',transmittalNumber.toString()) ,payload, this.httpOptions);       
        // this.api = this.http.get('./../assets/data/ddn.response.json');
        return this.result(Source.TransmittalList,new DepartmentDocRecordMapper(),{type:'CRUD',operation:'Department Document Record Successfuly Saved'});
    }
    
}