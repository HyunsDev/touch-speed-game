
import { useState, useEffect, useRef } from 'react';
import './css/App.scss';
import './css/game.scss';
import './css/screen.scss';

const ScreenBtns = (props) => {
  return (<div className={`btns team-${props.team}`} onClick={() => props.setReady(!props.isReady) }>
    <div className={`btn ${props.isReady ? "btn-ready" : ""}`}>
      {props.isReady ? "준비 완료!!!" : "준비"}
    </div>
    <div className='btn-team-name'>{props.team}번 플레이어 자리</div>
  </div>)
}

const CountdownScreen = (props) => {
  const [timer, setTimer] = useState(3)
  const time = useRef(3);
  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      if (time.current > 0) {
        time.current -= 1;
        setTimer(time.current);
      }
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      time.current = 0
      setTimer(time.current)
      props.gameStart()
    }
  }, [timer, props]);

  const numberBlock = (team) => (<div className={`countdown team-${String(team)}`}>
    {timer}
  </div>)

  return <>
    {numberBlock(1)}
    {numberBlock(2)}
  </>
}

const IntroScreen = (props) => {
  const [isYellowTeamReady, setYellowTeamReady] = useState(false)
  const [isGreenTeamReady, setGreenTeamReady] = useState(false)

  useEffect(() => {
    if (isYellowTeamReady && isGreenTeamReady) {
      props.setShowScreen(<CountdownScreen gameStart={props.gameStart} />)
    }
  }, [isYellowTeamReady, isGreenTeamReady, props])


  return (<>
  <ScreenBtns isReady={isYellowTeamReady} setReady={setYellowTeamReady} team="1"/>
    <div className='explain'>
      <h1>POS 줄다리기 게임</h1>
      <p>2명이 같이 플레이</p>
      <br /><br />
      <p>카운트 다운이 끝나면 자신 쪽의 화면을 연타해주세요!<br />제한 시간 안에 선을 자신쪽으로 넘기거나,<br />제한 시간 후 선이 가장 가까운 사람이 승리합니다</p>
    </div>
    <ScreenBtns isReady={isGreenTeamReady} setReady={setGreenTeamReady} team="2"/>
  </>)
}

const WinnerScreen = (props) => {
  const [timer, setTimer] = useState(3)
  const time = useRef(3);
  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      if (time.current > 0) {
        time.current -= 1;
        setTimer(time.current);
      }
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      time.current = 0
      setTimer(time.current)
      props.setShowScreen(<IntroScreen setShowScreen={props.setShowScreen} gameStart={props.gameStart}/>)
    }
  }, [timer, props]);

  const numberBlock = (team) => (<div className={`countdown team-${String(team)}`}>
    {props.winner === 0 ? "동점" : props.winner === team ? "승리!" : "패배"}
  </div>)

  return <>
    {numberBlock(1)}
    {numberBlock(2)}
  </>
}

const Screen = (props) => {
  const [ShowScreen, setShowScreen] = useState(<></>)

  useEffect(() => {
    setShowScreen(<WinnerScreen winner={props.winner} setShowScreen={setShowScreen} setShowScreen={setShowScreen} gameStart={props.gameStart} />)
  }, [props.gameStart])
  

  return (
    <div className='screen'>
      {ShowScreen}
    </div>
  )
}

function App() {
  const [isShowScreen, setShowScreen] = useState(true)
  const [lineMargin, setLineMargin] = useState(0)
  const [winner, setWinner] = useState(0)

  const [timer, setTimer] = useState(0)
  const time = useRef(0);
  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      if (time.current > 0) {
        time.current -= 1;
        setTimer(time.current);
      }
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0 || (lineMargin >= 20 || lineMargin <= -20)) {
      if (lineMargin > 0) {
        setWinner(2)
      } else if (lineMargin < 0) {
        setWinner(1)
      } else {
        setWinner(0)
      }

      setShowScreen(true)
      time.current = 0
      setTimer(time.current)
    }
  }, [timer, lineMargin]);

  const gameStart = () => {
    time.current = 10
    setTimer(time.current)
    setLineMargin(0)
    setShowScreen(false)
  }

  return (
    <div className="App">
      {isShowScreen ? <Screen setShowScreen={setShowScreen} gameStart={() => gameStart()} lineMargin={lineMargin} winner={winner}/> : <></>}
      <div className='game'>
        <div className="line" style={{marginTop: `${String(-100 + (lineMargin))}vh`}}>
          <div className='line-ribbon'></div>
        </div>
        <div className="fields">
          <div className='yellow-field field' onClick={() => setLineMargin(lineMargin-1)}>
            <div className='field-line'></div>
            <div className='field-count'>{timer}</div>
            <div className='field-title'>POS 동아리<br />줄다리기 미니게임</div>
          </div>
          <div className='green-field field' onClick={() => setLineMargin(lineMargin+1)}>
            <div className='field-line'></div>
            <div className='field-count'>{timer}</div>
            <div className='field-title'>POS 동아리<br />줄다리기 미니게임</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
