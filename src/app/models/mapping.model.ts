import { TransmittalResponse } from './transmittalResponse';
import { TransmittalDetailResponse } from './transmittalDetail';
import { formatDate } from '../helper/helper-methods';

export class DepartmentDocRecordMapper{
    map(response:TransmittalDetailResponse){
        //do api response mapping to model if necessary 
        response.readOnly = true;
        var segmented=  response.dateTimeStamp.split("T");
        response.dateTimeStamp =segmented[0] + " " + segmented[1].split(".")[0]
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