import React, {useState} from 'react';
import { Hint, FlexibleXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, AreaSeries, Crosshair } from 'react-vis';

import Global from '../styles/Global'

const Chart = ({style={},ticks = [], workoutData = [], hrData, powerData, currentTime}) => {
  const [hoveredValue, setHoveredValue] = useState();
  return (
    <div style={style}>
      <FlexibleXYPlot margin={{ color: 'white', left: 60, right: 40 }}>
        <HorizontalGridLines />
        <AreaSeries data={workoutData} onValueMouseOver={setHoveredValue}
    onValueMouseOut={() => setHoveredValue(null)}>
    <Hint value={hoveredValue}>
      <div>
        <span>This is a test</span>
      </div>
    </Hint>
        </AreaSeries>
      {hrData && <LineSeries color="red" data={hrData} />}
      {powerData && <LineSeries color="yellow" data={powerData} />}
      <XAxis style={{fill: "white"}} tickValues={ticks} tickFormat={value => Math.ceil(value / 1000 / 60)} />
      <YAxis style={{fill: "white"}} />
      </FlexibleXYPlot>
    </div>
);
}

export default Chart;

