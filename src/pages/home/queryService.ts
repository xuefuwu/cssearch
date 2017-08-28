import { Injectable } from "@angular/core";
import { Response, Http, URLSearchParams } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
import { HttpServiceProvider } from "../../providers/http-service";

@Injectable()
export class QueryService{
    url_csgl: string = "/api/csgl/ajax.jsp";
    constructor(private http:Http, private httpService:HttpServiceProvider){

    }
    doget(url: string, params: any) {
        return this.httpService.get(url, params).map((res: Response) => res.json());
    }

    querycsxx(name: string, no: string, pageindex: number ){
        var params = { name: name ? name : '', no: no ? no : '', county: '', pageindex: pageindex, pagesize: 100, f: "csquery"};
        return this.doget(this.url_csgl,params);
    }
}