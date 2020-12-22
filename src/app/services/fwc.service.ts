import { UpdateTransmittalRequest } from './../models/updateTransmittalRequest';
import { TransmittalResponse } from './../models/transmittalResponse';
import { Source, Status } from './../models/api.notification.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { APINotificationResult } from '../models/api.notification.model';
import { FWCDataBackend } from '../models/fwc.api.backend.model';
import { TransmittalSearchResponse } from '../models/transmittalSearchResponse';
import { TransmittalDetailResponse } from '../models/transmittalDetail';
const status = new Status(false,false,"");
@Injectable({providedIn:'root'})
export class FWCService{
    // private readonly _notifier = new Subject<APINotificationResult>();
    readonly notifier = new Subject<APINotificationResult>();
    readonly backend : FWCDataBackend;    

    retrieve(source : Source){
        return this.dataStore.find(f=>f.source==source);
    }

    
    private dataStore = [
        {
            source: Source.TransmittalSearch,
            data : [],
            status :status
        },{
            source: Source.TransmittalList,
            data : [],
            status :status
        },{
            source: Source.TransmittalSummary,
            data : [],
            status :status
        },{
            source: Source.TransmittalCreation,
            data : [],
            status :status
        },{
            source: Source.TransmittalUpdate,
            data : [],
            status :status
        },{
            source: Source.DeleteDepartmentDocument,
            data : [],
            status :status
        }
    ];

    constructor(private http : HttpClient){
        this.backend = new FWCDataBackend(http,this.notifier);    
        this.updateStore();            
    }    

    updateStore(){        
        this.notifier.subscribe(g=>{
            var index = this.dataStore.findIndex(f=>f.source==g.source);
            this.dataStore[index].status = g.status;  
            if(g.status.isCompleted){                    
                this.dataStore[index].data =  
                Array.isArray(g.result)? [...g.result] : 
                        [...this.retrieve(g.source).data,g.result];               
            }                           
        });
    }


}