import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { SimulatorStatusMap } from "../../utils/types";
import { Button, message, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { disconnectSimulator, simulationList, startSimulation, stopSimulation } from "../../api/simulation";

function Simulations() {
  const [list, setList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const onStopSimulation = async (simulatorId: string) => {
    let res = await stopSimulation(simulatorId);
    if (res.code == 200) {
      messageApi.open({
        type: "success",
        content: "停止成功",
      });
    }
  };
  const onDisconnectSimulator = async (simulatorId: string) => {
    let res = await disconnectSimulator(simulatorId);
    if (res.code == 200) {
      messageApi.open({
        type: "success",
        content: "断开成功",
      });
    }
  };
  const onStartSimulation = async (simulatorId: string) => {
    let res = await startSimulation(simulatorId);
    if (res.code == 200) {
      messageApi.open({
        type: "success",
        content: "启动成功",
      });
    }
  };

  useEffect(() => {
    getList();
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
      {contextHolder}
      <div className="flex justify-between p-5">
        <h2 className="text-3xl">仿真</h2>
        <Link to="/simulations/new">
          <Button>新建仿真</Button>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4 px-5">
        {list.map((simulation) => {
          const { alive, running } = simulation;
          return (
            <div className=" p-8 space-y-4 space-x-4  bg-sky-900 rounded-md" key={simulation.cid}>
              <div className="pv-4 text-center">
                <div
                  className="align-middle font-bold text-lg cursor-pointer"
                  onClick={() => navigate(`/simulations/${simulation.cid}`)}
                >
                  {simulation.cid}
                </div>
                <div className="mt-4">
                  <Space>
                    <Button className={`${alive ? "bg-green-400" : "bg-red-400"} font-bold text-white`}>
                      {alive ? "在线" : "离线"}
                    </Button>
                    <Button className={`${alive ? "bg-green-400" : "bg-red-400"} font-bold text-white`}>
                      {running ? "正在运行" : "停止运行"}
                    </Button>
                  </Space>
                </div>
                <div className="mt-5">
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => (running ? onStopSimulation(simulation.cid) : onStartSimulation(simulation.cid))}
                    >
                      {running ? "停止仿真" : "启动仿真"}
                    </Button>
                    <Button onClick={() => onDisconnectSimulator(simulation.cid)} danger type="primary">
                      断开连接
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
