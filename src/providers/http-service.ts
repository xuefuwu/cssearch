/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import { Injectable } from '@angular/core';
import {
    Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable, TimeoutError } from "rxjs";
import { Utils } from "./Utils";
import { GlobalData } from "./GlobalData";
import { NativeService } from "./NativeService"
import { QUALITY_SIZE, REQUEST_TIMEOUT } from "./Constants";
import { AppConfig } from "../app/app.config";

@Injectable()
export class HttpServiceProvider {
    private domain: string;

    //private domain:string = "http://oa.wzmzzj.gov.cn/weboa";
    constructor(public http: Http,
        private globalData: GlobalData,
        private nativeService: NativeService,
        private appConfig: AppConfig
    ) {
        this.domain = appConfig.APP_URL;
    }

    public request(url: string, options: RequestOptionsArgs): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        this.optionsAddToken(options);
        return Observable.create(observer => {
            //this.nativeService.showLoading();
            console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
            this.http.request(url, options).timeout(REQUEST_TIMEOUT).subscribe(res => {
                //this.nativeService.hideLoading();
                console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
                observer.next(res);
            }, err => {
                this.requestFailed(url, options, err);//处理请求失败
                observer.error(err);
            });
        });
    }

    public get(url: string, paramMap: any = null): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        return this.request(url, new RequestOptions({
            method: RequestMethod.Get,
            search: HttpServiceProvider.buildURLSearchParams(paramMap)
        }));
    }

    public post(url: string, body: any = {}): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        return this.request(url, new RequestOptions({
            method: RequestMethod.Post,
            body: body,
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        }));
    }
    public post1(url: string, body: any = {}): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        return this.http.post(url, body);
    }

    public postFormData(url: string, paramMap: any = null): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        var boundary = "abcd";
        return this.request(url, new RequestOptions({
            method: RequestMethod.Post,
            //search: HttpServiceProvider.buildURLSearchParams(paramMap).toString(),
            body: HttpServiceProvider.buildFormData(paramMap, boundary),
            headers: new Headers({
                'Content-Type': 'multipart/form-data; charset=UTF-8; boundary=' + boundary
            })
        }));
    }

    public put(url: string, body: any = {}): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        return this.request(url, new RequestOptions({
            method: RequestMethod.Put,
            body: body
        }));
    }

    public delete(url: string, paramMap: any = null): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        return this.request(url, new RequestOptions({
            method: RequestMethod.Delete,
            search: HttpServiceProvider.buildURLSearchParams(paramMap).toString()
        }));
    }

    public patch(url: string, body: any = {}): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        return this.request(url, new RequestOptions({
            method: RequestMethod.Patch,
            body: body
        }));
    }

    public head(url: string, paramMap: any = null): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        return this.request(url, new RequestOptions({
            method: RequestMethod.Head,
            search: HttpServiceProvider.buildURLSearchParams(paramMap).toString()
        }));
    }

    public options(url: string, paramMap: any = null): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        return this.request(url, new RequestOptions({
            method: RequestMethod.Options,
            search: HttpServiceProvider.buildURLSearchParams(paramMap).toString()
        }));
    }

    /**
     * 将对象转为查询参数
     * @param paramMap
     * @returns {URLSearchParams}
     */
    private static buildURLSearchParams(paramMap): URLSearchParams {
        let params = new URLSearchParams();
        if (!paramMap) {
            return params;
        }
        for (let key in paramMap) {
            let val = paramMap[key];
            if (val instanceof Date) {
                val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
            }
            params.set(key, val);
        }
        return params;
    }

    private static buildFormData(paramMap, boundary): FormData {
        var params = new FormData();
        for (let key in paramMap) {
            let val = paramMap[key];
            if (val instanceof Date) {
                val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss');
            }
            params.append(key, val);
        }
        return params;
    }

    /**
     * 处理请求失败事件
     * @param url
     * @param options
     * @param err
     */
    private requestFailed(url: string, options: RequestOptionsArgs, err: Response): void {
        url = Utils.formatUrl(url.startsWith('http') ? url : this.domain + url);
        this.nativeService.hideLoading();
        console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
        if (err instanceof TimeoutError) {
            this.nativeService.alert('请求超时,请稍后再试!');
            return;
        }
        let status = err.status;
        let result = err.json();
        let msg = result.message;
        if (!msg) {
            if (!this.nativeService.isConnecting()) {
                msg = '请求失败，请连接网络';
            } else {
                if (status === 0) {
                    msg = '请求失败，请求响应出错';
                } else if (status === 404) {
                    msg = '请求失败，未找到请求地址';
                } else if (status === 500) {
                    msg = '请求失败，服务器出错，请稍后再试';
                } else {
                    msg = '请求发生异常';
                }
            }
        }
        this.nativeService.alert(msg);
    }

    private optionsAddToken(options: RequestOptionsArgs): void {
        let token = this.globalData.token;
        if (options.headers) {
            options.headers.append('Authorization', 'Bearer ' + token);
        } else {
            options.headers = new Headers({
                'Authorization': 'Bearer ' + token
            });
        }
    }

}