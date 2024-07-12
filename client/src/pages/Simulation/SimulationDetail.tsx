import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Button, message, Popconfirm, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined, GlobalOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteSimulation, querySimulation, startSimulation } from "../../api/simulation";

function SimulationDetail() {
  const location = useLocation();
  const [simulation, setSimulation] = useState(null);
  const { id: simulationId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  useEffect(() => {
    getSimulationDetail();
  }, []);
  async function getSimulationDetail() {
    let res = await querySimulation(simulationId);
    if (res.code === 200) {
      setSimulation(res.result);
    }
    console.log(res, "res");
  }
  async function handleDeleteSimulation() {
    let res = await deleteSimulation(simulationId);
    if (res.code === 200) {
      navigate("/simulations", { replace: true });
    }
    console.log(res, "ss------delete");
  }
  if (!simulation) {
    return <></>;
  }
  const onStartSimulation = async (simulatorId: string) => {
    let res = await startSimulation(simulatorId);
    if (res.code == 200) {
      messageApi.open({
        type: "success",
        content: "启动成功",
      });
    }
  };
  return (
    <Layout>
      {contextHolder}
      <div className="flex justify-end p-5">
        <Space>
          <Link to={`/simulations/new/${simulationId}`}>
            <Button icon={<EditOutlined />} type="primary">
              编辑
            </Button>
          </Link>

          {/* <Button icon={<GlobalOutlined />}>取消发布</Button> */}
          <Popconfirm
            okText="确认"
            cancelText="取消"
            title="确认删除该仿真吗?"
            onConfirm={() => {
              handleDeleteSimulation();
            }}
          >
            <Button icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      </div>
      <div className="p-5 flex">
        <div className="mr-20 w-1/2">
          <h1 className="mb-3 font-bold text-2xl">仿真名称：{simulation.name}</h1>
          <div className="img-container relative w-[640px] mb-6">
            {!simulation.apiOnly && <img src={simulation.map.data.imageUrl} className=" rounded-lg" />}
            {!simulation.apiOnly && (
              <div className="flex  justify-center w-full mt-3">
                {simulation.vehicles.map((item, index) => (
                  <div className="h-20  rounded-full overflow-hidden border-2 border-black mx-2" key={item.vehicle.id}>
                    <img src={item.vehicle.data.imageUrl} className="max-h-full  max-w-none" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {simulation.description && <div className="my-2">描述：{simulation.description}</div>}
            <div className="mb-2">集群：{simulation.cluster.name}</div>
            <div className="mb-2">创建测试报告：{simulation.testreport ? "是" : "否"}</div>
            <div className="mb-2">线框模式：{simulation.wireframeMode ? "是" : "否"}</div>
          </div>
        </div>
        <div className="flex w-1/2 flex-col">
          <Button
            icon={<PlayCircleOutlined />}
            block
            size="large"
            type="primary"
            onClick={() => onStartSimulation(simulation.cid)}
          >
            运行仿真
          </Button>
          {/* <div className="mt-2 mb-4 bg-slate-600 rounded p-3">
            <div className="section-title ">Information</div>
            <p>
              <span className="w-20 inline-block text-slate-300 text-sm">Owner:</span>
              <span>Me</span>
            </p>
            <p>
              <span className="w-20 inline-block text-slate-300 text-sm">Status:</span>
              <span>Private</span>
            </p>
          </div> */}
          {!simulation.apiOnly && (
            <div className="mt-2 mb-4 bg-slate-600 rounded">
              <div className="section-title text-lg p-2" style={{ backgroundColor: "#3e414f" }}>
                资产
              </div>
              <div className="p-2">
                <p className="my-2">
                  <span className="w-20 inline-block text-slate-300 text-sm">地图：</span>
                  <span>{simulation?.map?.name}</span>
                </p>

                <p className="text-white text-lg">车辆</p>
                {simulation.vehicles.map((vehicle) => (
                  <div key={vehicle.id} className=" border-b-2 border-slate-900">
                    <p className="my-2">
                      <span className="w-40 inline-block text-slate-300 text-sm">名称：</span>
                      <span>{vehicle.vehicle.name}</span>
                    </p>
                    <p className="my-2">
                      <span className="w-40 inline-block text-slate-300 text-sm">仿真器配置：</span>
                      <span>{vehicle?.config.name}</span>
                    </p>
                    <p className="my-2">
                      <span className="w-40 inline-block text-slate-300 text-sm">Bridge：</span>
                      <span>{vehicle.bridge?.name}</span>
                    </p>
                    <p className="my-2">
                      <span className="w-40 inline-block text-slate-300 text-sm">Connection：</span>
                      <span>{vehicle.bridge?.connectionString}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default SimulationDetail;
