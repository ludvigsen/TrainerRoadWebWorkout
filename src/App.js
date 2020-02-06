import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import MainStore from './stores/MainStore';
import { getWorkout, getWorkouts } from './utils/TrainerRoadAPI';
import Main from './containers/Main';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';

const HR = '';
const POWER = '';
const CADENCE = '';
const FTP = 320;

const LoadWorkout = () => {
  let { workoutId } = useParams();
  const main = useContext(MainStore);
  // Initialize workout
  useEffect(() => {
    async function fetchData() {
      if (!workoutId) {
        const workouts = await getWorkouts();
        console.log('WORKOUTS: ', workouts);
        workoutId = workouts[4].Id;
      }
      const workout = await getWorkout(workoutId);
      console.log('WORKOUT: ', workout);
      main.workout = workout;
      main.workoutData = workout.workoutData.map(d => ({ x: d.seconds, y: d.memberFtpPercent }));
    }
    fetchData();
  }, [main]);
  return null;
};

const App = observer(() => {
  return (
    <Router>
      <Switch>
        <Route path="/:workoutId">
          <LoadWorkout />
          <Main />
        </Route>
        <Route path="/">
          <LoadWorkout />
          <Main />
        </Route>
      </Switch>
    </Router>
  );
});

export default App;
