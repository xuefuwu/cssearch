
export class AppConfig {

    private domain: string;
    private app: string;
    constructor() {
        this.app = "http://localhost:8100";
        //this.app = "http://oa.wzmzzj.gov.cn/cssearch/";
        this.domain = "http://oa.wzmzzj.gov.cn/weboa";
    }
    get Domain() {
        return this.domain;
    }
    get APP_URL() {
        return this.app;
    }

}