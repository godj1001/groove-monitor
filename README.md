# groove-monitor 
a simple monitor package 

# Getting Started
```
npm i groove-monitor
yarn add groove-monitor
```

```
new Monitor(options)
```

you can set options to change the monitor function ;

```
export const defaultConfig = {
    errorCount: 5,
    clearTimer: 10000,
    showTimeReport: true,
    errorStore : function(errorObj)  {
        
    },
    falseAlarms: function(errorObj){
        
    }
}
```