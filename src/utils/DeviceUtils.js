const HR = 'heart_rate';
const POWER = 'cycling_power';
const CADENCE = 'cycling_speed_and_cadence';
const CHANGE_EVENT = 'characteristicvaluechanged';

//const FTP = 320;

const characteristicMap = {
  heart_rate: 'heart_rate_measurement',
  cycling_power: 'cycling_power_measurement',
  cycling_speed_and_cadence: 0x2a5b,
};

const writeValueCharacteristicUUID = 'a026e0050a7d4ab397faf1500f9feb8b';
// e0 = 224;
const writeSetErgResistanceTo224 = '42e000';

const ble_sint16 = ['getInt16', 2, true];
const ble_uint8 = ['getUint8', 1];
let ble_uint16 = ['getUint16', 2, true];
let ble_uint32 = ['getUint32', 4, true];
// TODO: paired 12bit uint handling
let ble_uint24 = ['getUint8', 3];

const cycling_power_measurement = [
  [0, [[ble_sint16, 'instantaneous_power']]],
  [1, [[ble_uint8, 'pedal_power_balance']]],
  [
    2,
    [
      /* Pedal Power Balance Reference */
    ],
  ],
  [4, [[ble_uint16, 'accumulated_torque']]],
  [
    8,
    [
      /* Accumulated Torque Source */
    ],
  ],
  [
    16,
    [
      [ble_uint32, 'cumulative_wheel_revolutions'],
      [ble_uint16, 'last_wheel_event_time'],
    ],
  ],
  [
    32,
    [
      [ble_uint16, 'cumulative_crank_revolutions'],
      [ble_uint16, 'last_crank_event_time'],
    ],
  ],
  [
    64,
    [
      [ble_sint16, 'maximum_force_magnitude'],
      [ble_sint16, 'minimum_force_magnitude'],
    ],
  ],
  [
    128,
    [
      [ble_sint16, 'maximum_torque_magnitude'],
      [ble_sint16, 'minimum_torque_magnitude'],
    ],
  ],
  [256, [[ble_uint24, 'maximum_minimum_angle']]],
  [512, [[ble_uint16, 'top_dead_spot_angle']]],
  [1024, [[ble_uint16, 'bottom_dead_spot_angle']]],
  [2048, [[ble_uint16, 'accumulated_energy']]],
  [
    4096,
    [
      /* Offset Compensation Indicator */
    ],
  ],
];

const getPowerData = dataview => {
  let offset = 2;
  const mask = dataview.getUint16(0, true);
  const fields = cycling_power_measurement;

  let fieldArrangement = [];

  // Contains required fields
  if (fields[0][0] === 0) {
    for (let fdesc of fields[0][1]) {
      fieldArrangement.push(fdesc);
    }
  }

  for (let [flag, fieldDescriptions] of fields) {
    if (mask & flag) {
      for (let fdesc of fieldDescriptions) {
        fieldArrangement.push(fdesc);
      }
    }
  }

  let data = {};
  for (let field of fieldArrangement) {
    var [[accessor, fieldSize, endianness], fieldName] = field;
    let value;
    if (endianness) {
      value = dataview[accessor](offset, endianness);
    } else {
      value = dataview[accessor](offset);
    }

    data[fieldName] = value;
    offset += fieldSize;
  }

  return data['instantaneous_power'];
};

const getHeartRateData = value => value.getUint8(1);

const dataFunction = {
  cycling_power: getPowerData,
  heart_rate: getHeartRateData,
};

const connectDevice = serviceName => async (callback = () => {}) => {
  if (localStorage.getItem('simulation') === 'true') {
    let interval;
    return {
      device: {},
      server: {},
      start: () => {
        interval = setInterval(() => {
          const factor = serviceName === HR ? 300 : serviceName === CADENCE ? 120 : 180;
          callback(Math.round(Math.random() * factor));
        }, 1000);
      },
      stop: () => {
        clearInterval(interval);
      },
    };
  }
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [serviceName] }],
      optionalServices: [serviceName],
    });

    const server = await device.gatt.connect();

    const service = await server.getPrimaryService(serviceName);
    const characteristic = await service.getCharacteristic(characteristicMap[serviceName]);
    console.log(`connected to ${serviceName}`);

    function listener(event) {
      const data = dataFunction[serviceName](event.target.value);
      console.log('DATA: ', data);
      callback(data);
    }

    characteristic.addEventListener(CHANGE_EVENT, listener);
    characteristic.startNotifications();

    return {
      device,
      server,
      service,
      start: () => {
        characteristic.startNotifications();
      },
      stop: () => {
        characteristic.stopNotifications();
        characteristic.removeEventListener(CHANGE_EVENT, listener);
      },
    };
  } catch (e) {
    console.error('Could not connect to any devices', e);
    return null;
  }
};

export const connectPowerMeter = connectDevice(POWER);
export const connectHeartRateMonitor = connectDevice(HR);
export const connectCadenceMeter = connectDevice(CADENCE);
