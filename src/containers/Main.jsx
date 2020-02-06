import React, { useState, useContext, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import MainStore from '../stores/MainStore';
import SensorDataStore from '../stores/SensorDataStore';
import Chart from '../components/Chart';
import Grid from '../components/Grid';
import Tile from '../components/Tile';
import Global from '../styles/Global';
import moment from 'moment';
import { useParams } from 'react-router-dom'

import { connectPowerMeter, connectHeartRateMonitor, connectCadenceMeter } from '../utils/DeviceUtils'

const styles = {
  color: Global.foreground,
  backgroundColor: Global.background,
  display: 'grid',
  textAlign: 'center',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

const flexItem = {
  gridColumn: 1 / 2,
  height: '100%'
}

const Main = observer(() => {

  const main = useContext(MainStore);
  const [time, setTime] = useState();

  const animate = () => {
    if (main.running) {
      setTime(Date.now() - main.startTime);
    }
    requestRef.current = requestAnimationFrame(animate);
  };
  const requestRef = useRef();
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);


  const sensorData = useContext(SensorDataStore);
  const pairHR = async () => {
    const hrMonitor = await connectHeartRateMonitor(hr => {
      sensorData.addHr(hr);
    });
    if (hrMonitor) {
      hrMonitor.start();
    }
  }

  const pairPower = async () => {
    console.log('CONNECTION POWER')
    const powerMeter = await connectPowerMeter(power => {
      sensorData.addPower(power);
    });
    if (powerMeter) {
      powerMeter.start();
    }
  }

  const pairCadence = async () => {
    const cadenceMeter = await connectCadenceMeter(cadence => {
      sensorData.addCadence(cadence);
    })
    if (cadenceMeter) {
      cadenceMeter.start();
    }
  }
  const ticks =
    main.workoutData.length > 0
      ? [
          main.workoutData[0].x,
          main.workoutData[Math.floor(main.workoutData.length / 2)].x,
          main.workoutData[main.workoutData.length - 1].x,
        ]
    : [];

  const toggleWorkout = () => {
    if (main.running) {
      main.running = false;
      main.pauseTime = Date.now();
    } else {
      main.running = true;
      if (main.startTime && main.pauseTime) {
        main.startTime = main.startTime + (Date.now() - main.pauseTime)
      } else {
        main.startTime = Date.now()
      }
    }
  }

  const workoutTime = main.startTime ? Date.now() - main.startTime : 
    main.pauseTime ? main.pauseTime - main.startTime : 0;

  const workoutTimeString = workoutTime ? moment.utc(workoutTime).format('HH:mm:ss.SSS') : '00:00:00.000'

  const interval = main.workout && 
    main.workout.intervalData && 
    main.workout.intervalData.filter(({IsFake}) => !IsFake).sort((x, y) => x.End-y.End).find(({End}) => End > (workoutTime / 1000));
  console.log('workoutTime: ', workoutTime / 1000);
  console.log('INTERVAL', interval);
  console.log('interval data',  main.workout.intervalData);
  const intervalTime = interval ? moment.utc((interval.End * 1000) - workoutTime).format('HH:mm:ss.SSS') : '00:00:00.000'
  const target = main.workout.workoutData && main.workout.workoutData.find(({seconds}) => (Math.round((workoutTime || 1) / 1000) * 1000) === seconds);
  console.log('TARGET: ', target);
  return (
    <div style={styles}>
      <Grid style={flexItem}>
        <Tile width="25%" title="POWER" value={sensorData.power} onClick={pairPower}/>
        <Tile width="50%" title="INTERVAL TIME" value={intervalTime} />
        <Tile width="25%" title="HEART RATE" value={sensorData.hr} onClick={pairHR}/>
        <Tile width="25%" title="TARGET" value={target ? target.memberFtpPercent : '---'} />
        <Tile width="50%" title="WORKOUT TIME" value={workoutTimeString} onClick={toggleWorkout}/>
        <Tile width="25%" title="CADENCE" value={sensorData.cadence} onClick={pairCadence} />
      </Grid>
      <Chart 
    style={flexItem}
    ticks={ticks} 
    workoutData={main.workoutData} 
    currentTime={workoutTime}
    hrData={main.startTime ? sensorData.heartRateMonitorData
      .filter(({time}) => time -main.startTime >= 0).map(({value, time}) => 
        ({x: time - main.startTime, y: value})) : []}
    powerData={main.startTime ? sensorData.powerData
      .filter(({time}) => time -main.startTime >= 0).map(({value, time}) => 
      ({x: time - main.startTime, y: value})) : []}/>
 
    </div>
  );  
});

export default Main;
