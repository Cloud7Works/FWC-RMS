import { TransmittalDetailModel } from './transmittal-detail.model';
import { TransmittalResponse } from './transmittalResponse';
import { TransmittalDetailResponse } from './transmittalDetail';

export class DepartmentDocRecordMapper{
    map(response:TransmittalDetailModel){
        //do api response mapping to model if necessary 
        if(Array.isArray(response)){
            return response.map(f=>{
                this.formatData(f);
                return f;
            });
        }
       
        return this.formatData(response);
    }

    private formatData(response){
        response.readOnly = true;        
        var segmented=  response.dateTimeStamp.split("T");
        response.dateTimeStamp =segmented[0] + " " + (<string>segmented[1].split(".")[0]).substring(0,8);
        return response;
    }
}

export class UpdateDepartmentDocRecordMapper{
    
    constructor(private refRecord : TransmittalDetailModel){    
    }
    map(response:TransmittalDetailModel){
        //do api response mapping to model if necessary 
        this.refRecord.cashListing=response.cashListing;
        this.refRecord.checkAmount=response.checkAmount;
        this.refRecord.checkNumber=response.checkNumber;
        this.refRecord.comments=response.comments;
        this.refRecord.companyName=response.companyName;
        this.refRecord.firstName= response.firstName;
        this.refRecord.lastName=response.lastName;
        return response;       
    }
}

export class RecentTransmittalMapper{
    map(response:TransmittalResponse[]){
        //do api response mapping to model if necessary 
        return response.map(d=>{
            d.transmittalDate=d.transmittalDate.split('T')[0];
            return d;
        });        
    }
}

export class CreateTransmittalMapper{
    map(response:TransmittalResponse){
        //do api response mapping to model if necessary 
        response.transmittalDate=response.transmittalDate.split('T')[0];
        return response;       
    }
}