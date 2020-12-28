import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { APINotificationResult } from "../models/api.notification.model";
@Injectable()
export class NotificationService{
    notify = new Subject<APINotificationResult>()
}