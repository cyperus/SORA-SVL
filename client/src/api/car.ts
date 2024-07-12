import request from "../utils/request";
export function querySensor(type: string) {
  return request({
    url: `/v2/sensor/querySensorType`,
    method: "get",
    params: { type },
  });
}

export function querySensorConfig(configId: string) {
  return request({
    url: `/v2/sensor/querySensorsByConfigId`,
    method: "get",
    params: { configId },
  });
}

export function updateSensors(configId: string, sensors: any) {
  return request({
    url: `/v2/sensor/updateSensors?configId=${configId}`,
    method: "put",
    data: sensors,
  });
}

export function queryBridges() {
  return request({
    url: "/v2/sensor/queryBridges",
    method: "get",
  });
}

export function addSensorConfig(config) {
  return request({
    url: "/v2/sensor/addSensorConfig",
    method: "get",
    params: config,
  });
}
export function querySensorConfigs(vehicleId) {
  return request({
    url: "/v2/sensor/querySensorConfigs",
    method: "get",
    params: { vehicleId },
  });
}
export function deleteSensorConfig(configId) {
  return request({
    url: "/v2/sensor/delSensorConfig",
    method: "delete",
    params: { configId },
  });
}

export function vechilesList() {
  return request({
    url: "/v2/vehicles/list",
  });
}
