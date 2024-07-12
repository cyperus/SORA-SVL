import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { SimulatorStatusMap } from "../../utils/types";
import { Button, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { simulationList } from "../../api/simulation";

function Simulations() {
  const onStopSimulation = (simulatorId: string) => {
    fetch(`/api/v1/clusters/stop/${simulatorId}`);
  };
  const onDisconnectSimulator = (simulatorId: string) => {
    fetch(`/api/v1/clusters/disconnect/${simulatorId}`);
  };
  const onStartSimulation = (simulatorId: string) => {
    fetch(`/api/v1/clusters/start/apiOnly/${simulatorId}`);
  };
  const [list, setList] = useState([]);

  const [simulatorStatus, setSimulatorStatus] = useState<SimulatorStatusMap>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimulatorStatus = async () => {
      const res = await fetch(`/api/v1/clusters/simulatorStatus`);
      const simulatorStatus = await res.json();
      setSimulatorStatus(simulatorStatus as SimulatorStatusMap);
    };

    fetchSimulatorStatus();
    const updateSimulatorStatus = setInterval(() => {
      // fetchSimulatorStatus();
    }, 500);
    getList();
    return () => {
      clearInterval(updateSimulatorStatus);
    };
  }, []);
  const getList = async () => {
    const result = await simulationList();
    if (result.code == 200) {
      setList(result.result);
    }
    console.log(result);
  };
  return (
    <Layout>
      <div className="flex justify-between p-5">
        <h2 className="text-3xl">仿真</h2>
        <Link to="/simulations/new">
          <Button>新建仿真</Button>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4 px-5">
        {list.map((simulatorId) => {
          const { alive, running } = simulatorStatus[simulatorId];
          return (
            <div className=" p-8 space-y-4 space-x-4  bg-sky-900 rounded-md" key={simulatorId}>
              <div className="pv-4 text-center">
                <div
                  className="align-middle font-bold text-lg cursor-pointer"
                  onClick={() => navigate(`/simulations/${simulatorId}`)}
                >
                  {simulatorId}
                </div>
                <div className="mt-4">
                  <Space>
                    <Button className={`${alive ? "bg-green-400" : "bg-red-400"} font-bold text-white`}>
                      {alive ? "Online" : "Offline"}
                    </Button>
                    <Button className={`${alive ? "bg-green-400" : "bg-red-400"} font-bold text-white`}>
                      {running ? "Running" : "Stopped"}
                    </Button>
                  </Space>
                </div>
                <div className="mt-5">
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => (running ? onStopSimulation(simulatorId) : onStartSimulation(simulatorId))}
                    >
                      {simulatorStatus[simulatorId].running ? "Stop Simulation" : "Start Simulation"}
                    </Button>
                    <Button onClick={() => onDisconnectSimulator(simulatorId)} danger type="primary">
                      Disconnect
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export default Simulations;
