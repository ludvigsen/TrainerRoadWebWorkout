import { createContext } from 'react';
import { decorate, observable, computed } from 'mobx';

class SensorData {
  powerData = [];
  heartRateMonitorData = [];
  cadenceData = [];

  get power() {
    if (this.powerData.length > 0) {
      return this.powerData[this.powerData.length - 1].value;
    }
    return -1;
  }

  get hr() {
    if (this.heartRateMonitorData.length > 0) {
      return this.heartRateMonitorData[this.heartRateMonitorData.length - 1].value;
    }
    return -1;
  }

  get cadence() {
    if (this.cadenceData.length > 0) {
      return this.cadenceData[this.cadenceData.length - 1].value;
    }
    return -1;
  }

  addHr = value => {
    this.heartRateMonitorData.push({ time: Date.now(), value });
  };

  addPower = value => {
    this.powerData.push({ time: Date.now(), value });
  };

  addCadence = value => {
    this.cadenceData.push({ time: Date.now(), value });
  };
}

decorate(SensorData, {
  powerData: observable,
  heartRateMonitorData: observable,
  cadenceData: observable,

  power: computed,
  hr: computed,
  cadence: computed,
});

export default createContext(new SensorData());
