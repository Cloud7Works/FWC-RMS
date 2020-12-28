
import { Progress, Source, Status } from './../models/api.notification.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { APINotificationResult } from '../models/api.notification.model';
import { FWCDataBackend } from '../models/fwc.api.backend.model';
import { ConfigurationService } from './configuration.service';
import { NotificationService } from './notification.service';
const status = new Status(false,false,"",Progress.Idle);
@Injectable({providedIn:'root'})
export class FWCService{    
    
    constructor(public backend : FWCDataBackend,public notification : NotificationService){         
        this.updateStore();            
    }    
        
    send = new Subject<boolean>();
    retrieve(source : Source){
        return this.dataStore.find(f=>f.source==source);
    }
    
    /**
     * @summary API Response data store 
     * [Source.TransmittalSearch - TransmittalSearchResponse] 
     * [Source.TransmittalList - TransmittalDetailModel]
     * [Source.TransmittalSummary - TransmittalResponse]
     * [Source.TransmittalCreation - TransmittalResponse]
     * [Source.TransmittalUpdate - TransmittalResponse]     
     */
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
        },{
            source: Source.UpdateDepartmentDocumentRecord,
            data : [],
            status :status
        }
    ];

    updateStore(){               
        this.notification.notify.subscribe(g=>{
            var index = this.dataStore.findIndex(f=>f.source==g.source);
            this.dataStore[index].status = g.status;  
            if(g.status.isCompleted && !g.status.isError){                    
                this.dataStore[index].data =  
                Array.isArray(g.result)? [...g.result] : 
                        [...this.retrieve(g.source).data,g.result];                                  
            }                           
        });
    }


}