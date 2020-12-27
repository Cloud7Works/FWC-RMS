import { AppConfiguration } from './app.configuration';
import { Injectable } from "@angular/core";
import * as _config from '../config/config.json';
@Injectable()
export class ConfigurationService{
    config = _config;
    constructor(private appConfig : AppConfiguration){        
        this.config=appConfig.config;
    }   

    
}