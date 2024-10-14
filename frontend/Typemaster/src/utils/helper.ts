export const calculateWPM =(correctWords:number,numberOfErrors:number,timeInMinutes:number):number=>{
    if(timeInMinutes===0)
    {
        return 0;
    }
    let wpm=(correctWords-numberOfErrors);
    wpm/=timeInMinutes;
    // wpm-=((numberOfErrors/5)/timeInMinutes);
    wpm=Math.floor(wpm);
    return Math.max(0,wpm);
}