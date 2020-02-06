import { createContext } from 'react';
import { decorate, observable, computed } from 'mobx';

export class Main {
  workout = {};
  workoutData = [];

  running = false;
  startTime = undefined;
  pauseTime = undefined;
}

decorate(Main, {
  workout: observable,
  workoutData: observable,

  running: observable,
  startTime: observable,
  pauseTime: observable,
});

export default createContext(new Main());
