import { isWindowEnv } from "../utils/index";
import { defaultConfig } from "../config/default_config";
export class Monitor {
    constructor(options){
        this.options = Object.assign(defaultConfig,options)
        this.errorFn = this.alarmFn()
        this.init()
    }

    init(){
        if(isWindowEnv){
            this.rewriteOnerror()
            this.rewirteConsoleError()

            this.performance = window.performance || window.msPerformance|| window.webkitPerformance
            if(this.options.showTimeReport){
                requestIdleCallback(() => {
                    this.logTime()
                })
            }
        }
    }

    rewriteOnerror(){
        window.onerror = (errMsg,url,line,column,errorObj) => {
            this.errorFn({
                errMsg,
                url,
                line,
                column,
                errorObj
            })
        }
    }

    rewirteConsoleError(){
        const oldError = console.error
        const errorFn = this.errorFn
        console.error = function() {
            var errMsg = arguments[0] && arguments[0].message;
            var line = 0;
            var column = 0;
            var errorObj = arguments[0] && arguments[0].stack;
            if (!errorObj) errorObj = arguments[0];
            // 如果onerror重写成功，就无需在这里进行上报了
            errorFn({
                errMsg,
                url:'',
                line,
                column,
                errorObj
            })
            return oldError.apply(console, arguments);
        }
    }

    alarmFn(){
        let count = 0
        let timer = null
        const options = this.options
        return function(errorObj){
            count ++ 
            options.errorStore(errorObj)
            if(timer === null ){
                timer = setTimeout(() => {
                    if(count > options.errorCount){
                        options.falseAlarms(errorObj)
                    }
                    count = 0
                    timer = null
                },options.clearTimer)
            }
        }
    }

    logTime(){
        if(!this.performance) return 
        const timing = this.performance.timing
        const navigation = this.performance.navigation
        const report = {}

        report['重定向耗时'] = timing.redirectEnd - timing.redirectStart;
        report['APP CACHE 耗时'] = Math.max(timing.domainLookupStart - timing.fetchStart, 0);
        report['DNS 解析耗时'] = timing.domainLookupEnd - timing.domainLookupStart;
        report['TCP 链接耗时'] = timing.connectEnd - timing.connectStart;
        report['服务器响应耗时'] = timing.responseStart - timing.requestStart;
        report['内容加载耗时'] = timing.responseEnd - timing.responseStart;
        report['网络交互耗时'] = timing.responseEnd - timing.navigationStart;
        report['渲染耗时'] = (timing.domComplete || timing.domLoading) - timing.domLoading;
        report['load事件完成'] = timing.loadEventEnd - timing.loadEventStart;
        report['总耗时'] = (timing.loadEventEnd || timing.loadEventStart || timing.domComplete || timing.domLoading) - timing.navigationStart;
        report['可交互'] = timing.domInteractive - timing.navigationStart;
        report['首次出现内容']= timing.domLoading - timing.navigationStart;
        report['内容加载完毕'] = timing.loadEventEnd - timing.navigationStart;

        for(let item of Object.keys(report)){
            console.log(item + ':' + report[item] + '毫秒');
        }

        console.log('report finish');
    }
}