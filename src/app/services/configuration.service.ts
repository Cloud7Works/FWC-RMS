import { AppConfiguration } from './app.configuration';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import * as _config from '../config/config.json';
@Injectable()
export class ConfigurationService{
    config = _config;
    constructor(private http:HttpClient,private appConfig : AppConfiguration){        
        this.config=appConfig.config;
    }   

    
}