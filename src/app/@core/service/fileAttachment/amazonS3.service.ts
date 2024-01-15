import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/enviroment";

@Injectable({providedIn: 'root'})
export class AmazonS3Service {
  constructor(private http: HttpClient) {
  }

  createUrlFile(path: string | undefined) {
    return environment.serverUrl.minio + path;
  }
}
