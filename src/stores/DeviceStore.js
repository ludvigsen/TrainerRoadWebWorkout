import { createContext } from 'react';
import { decorate, observable, computed } from 'mobx';

export class Devices {
  powerMeters = [];

  heartRateMonitors = [];

  cadenceMeters = [];

  selectedPowerMeter = -1;
  selectedHeartRateMonitor = -1;
  selectedCadenceMeter = -1;

  get powerMeter() {
    if (this.powerMeters.length > this.selectedPowerMeter && this.selectedPowerMeter !== -1) {
      return this.powerMeters[this.selectedPowerMeter];
    }
    return null;
  }

  get heartRateMonitor() {
    if (this.heartRateMonitors.length > this.selectedHeartRateMonitor && this.selectedHeartRateMonitor !== -1) {
      return this.heartRateMonitors[this.selectedHeartRateMonitor];
    }
    return null;
  }

  get cadenceMeter() {
    if (this.cadenceMeters.length > this.selectedCadenceMeter && this.selectedCadenceMeter !== -1) {
      return this.cadenceMeters[this.selectedCadenceMeter];
    }
    return null;
  }

  addPowerMeter(powerMeter) {
    this.powerMeters.push(powerMeter);
  }
  addHeartRateMonitor(heartRateMonitor) {
    this.heartRateMonitor.push(heartRateMonitor);
  }
  addCadenceMeter(cadenceMeter) {
    this.cadenceMeters.push(cadenceMeter);
  }
}

decorate(Devices, {
  powerMeter: computed,
  heartRateMonitor: computed,
  cadenceMeter: computed,
});

export default createContext(new Devices());
