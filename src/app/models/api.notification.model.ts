import { Observable } from "rxjs";
import { CreateTransmittalDetailRequest } from "./createTransmittalDetailRequest";
import { SearchType } from "./search-type.enum";
import { TransmittalDetailModel } from "./transmittal-detail.model";
import { TransmittalDetailResponse } from "./transmittalDetail";
import { TransmittalResponse } from "./transmittalResponse";
import { TransmittalSearchRequest } from "./transmittalSearchRequest";
import { TransmittalSearchResponse } from "./transmittalSearchResponse";
import { UpdateTransmittalRequest } from "./updateTransmittalRequest";

export enum Source{
    TransmittalSearch = 'Transmittal Search',
    TransmittalCreation = 'Transmittal Creation',
    TransmittalUpdate = 'Transmittal Update',    
    TransmittalList = 'Department Doc Record',
    TransmittalSummary = 'Recent Transmittals',
    DeleteDepartmentDocument = 'Delete Department Document',
    UpdateDepartmentDocumentRecord = 'Update Department Document Record'
}
export enum Progress{
    Idle=0,
    InProgress=1,
    Completed =2
}

export class Status{
    constructor(public isCompleted: boolean,public isError: boolean, public message: any,public progress:Progress){
        this.isCompleted=isCompleted;
        this.isError=isError;
        this.message=message;
        this.progress = progress;
    }
}

export class APINotificationResult{
    constructor(public source : Source, public status : Status, public result :any){
        this.source = source;
        this.status = status;
        this.result = result;
    }
}

export interface APISignature{

    departmentDocumentSearch(type : SearchType,payload : TransmittalSearchRequest) : Observable<TransmittalSearchResponse[]>; 
    departmentDocumentSearch(type : SearchType,payload : string) : Observable<TransmittalSearchResponse[]>; 
    createTransmittal(transmittalDate : string, transmittalStatus : string) : Observable<TransmittalResponse>;   
    getTransmittals() : Observable<TransmittalResponse[]>;        
    updateTransmittal(transmittalNumber: number,model : UpdateTransmittalRequest) : Observable<TransmittalResponse>;
    deleteDepartmentDocRecord(transmittal: number, departmentDocumentNumber : number) : Observable<any>;
    getDeptDocRecord(transmittalNumber : number) :  Observable<TransmittalDetailModel>;
    createDepartmentDocumentNumber(transmittalNumber : number, payload : CreateTransmittalDetailRequest): Observable<TransmittalDetailModel>;
}

