import request from "../utils/request";

// 新增仿真
export function addSimulation(data) {
  return request({
    url: `/v2/simulation`,
    method: "post",
    data,
  });
}
export function updateSimulation(data) {
  return request({
    url: `/v2/simulation`,
    method: "put",
    data,
  });
}
// 仿真详情
export function querySimulation(simulationId: string) {
  return request({
    url: `/v2/simulation`,
    method: "get",
    params: { simulationId },
  });
}

// cluster list
export function queryClusterList() {
  return request({
    url: `/v2/cluster/list`,
    method: "get",
  });
}
// 删除仿真
export function deleteSimulation(simulationId: string) {
  return request({
    url: `/v2/simulation`,
    method: "delete",
    params: { simulationId },
  });
}
// 仿真列表
export function simulationList() {
  return request({
    url: `/v2/simulation/list`,
    method: "get",
  });
}
export function connect(simid: string) {
  return request({
    url: `/v2/simulation/connect`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      simid,
    },
  });
}

export function startSimulation(simulationId: string) {
  return request({
    url: `/v2/simulation/start/apiOnly`,
    method: "get",
    params: { simulationId },
  });
}

export function stopSimulation(simulationId: string) {
  return request({
    url: `/v2/simulation/stop`,
    method: "get",
    params: { simulationId },
  });
}

export function disconnectSimulator(simulationId: string) {
  return request({
    url: `/v2/simulation/disconnect`,
    method: "get",
    params: { simulationId },
  });
}
/**
 * 查询Bridge相关下拉列表
 * @param role
 * @returns
 */
export function queryBridgeParams(role: string) {
  return request({
    url: `/v2/sensor/queryBridgeParams`,
    method: "get",
    params: { role },
  });
}
