export const defaultConfig = {
    errorCount: 5,
    clearTimer: 10000,
    showTimeReport: true,
    errorStore : function(errorObj)  {
        console.log('store',errorObj);
    },
    falseAlarms: function(){
        console.log('warm',arguments)
    }
}