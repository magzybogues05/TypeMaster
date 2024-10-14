import React, { useEffect, useState } from 'react'
import { calculateWPM } from '../utils/helper';

const GameArea = ({socket,text}:{socket:WebSocket;text:String[]}) => {
  
  const [inputValue,setInputValue]=useState('');
  const [index,setIndex]=useState(0);
  const [errorColor,setErrorColor]=useState('green');
  const [speed,setSpeed]=useState(0);
  const [errorWords,setErrorWords]=useState(new Set());
  const [seconds,setSeconds]=useState(0);
  const [wpm,setWPM]=useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= 60) {
          clearInterval(intervalId); // Stop the interval if 60 seconds have passed
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // Cleanup the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run on component mount

  useEffect(()=>{

    setWPM(calculateWPM(index,errorWords.size,seconds/60))

  },[seconds]);

  const handleChange=(typedWord:string)=>{
      setInputValue(typedWord);
      let len=typedWord.length;
      const currWord=text[index];
      if(len>currWord.length)
      {
        len=currWord.length;
      }
      const splittedWord=currWord.slice(0,len);
      if(typedWord!==splittedWord)
      {
          setErrorColor('red');
          setErrorWords((prev)=>new Set(prev).add(index));
      }
      else{
          setErrorColor('green');
      }

  }

  const handleSpace=(e:any)=>{
      if(e.key===' ')
      {
          e.preventDefault();
          if(inputValue.trim()===text[index])
          {
              setIndex((prev)=>prev+1);
              setErrorColor('green');
              setInputValue('');
              e.target.value='';
          }
      }
  }

  return (
    <div>
      <div>
        Time: {seconds}
      </div>
      <div>
        WPM: {wpm}
      </div>
        <div className='text-2xl'>
            {text.join(" ")}
        </div>
      <div>
        <input type="text" className='mt-12 w-full h-10 text-2xl p-2' value={inputValue} style={{color:`${errorColor}`}} onChange={(e)=>handleChange(e.target.value)} onKeyDown={(e)=>handleSpace(e)}/>
      </div>
      <div className='mt-12'>
          Errors: {[...errorWords].join(', ')}
      </div>
    </div>
  )
}

export default GameArea
