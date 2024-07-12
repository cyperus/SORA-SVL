import { useEffect, useState } from "react";
import type { InputNumberProps } from "antd";
import dayjs from "dayjs";
import Layout from "../../components/Layout";
import Navigation from "../../components/Navigation";
import {
  Button,
  message,
  Steps,
  Select,
  Form,
  Input,
  Row,
  Col,
  Switch,
  DatePicker,
  TimePicker,
  Slider,
  InputNumber,
} from "antd";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useNavigate, useParams } from "react-router-dom";
import { listMaps, listVehicles } from "../../api/vehicle";
import { querySensorConfigs, vechilesList } from "../../api/car";
import { MergeOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  addSimulation,
  queryBridgeParams,
  queryClusterList,
  querySimulation,
  updateSimulation,
} from "../../api/simulation";
const { Option } = Select;
dayjs.extend(utc);
dayjs.extend(timezone);
const autopilotOptions = [
  {
    value: "ROS",
    label: "ROS1",
  },
  {
    value: "ROS2",
    label: "ROS2",
  },
  {
    value: "AutowareAi Control Sensor",
    label: "Autoware",
  },
  {
    value: "Apollo Control Sensor",
    label: "Apollo6.0",
  },
];
const steps = [
  {
    title: "First",
    content: "First-content",
  },
  {
    title: "Second",
    content: "Second-content",
  },
  {
    title: "Third",
    content: "Last-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
];
const items = [
  {
    key: "general",
    title: "常规",
  },
  {
    key: "testcase",
    title: "资源配置",
  },
  {
    key: "autopilot",
    title: "算法接入",
  },
  {
    key: "publish",
    title: "配置发布",
  },
];
function NewSimulation() {
  const [current, setCurrent] = useState(0);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [vehicles, setVehicles] = useState([
    { id: 1, vehicle: null, config: null, configList: [], vehicleEngineer: null, imageUrl: null },
  ]);
  const [mapOptions, setMapOptions] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [clusterOptions, setClusterOptions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [inputValue, setInputValue] = useState(1);
  const [rosComuOptions, setRosComuOptions] = useState([]);
  const [simTimeClockOptions, setSimTimeClockOptions] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    getVehicleList();
    getMapList();
    getClusterList();
    getSimulationDetail();
    getBridgeParams("RosComu");
    getBridgeParams("SimTimeClock");
  }, []);
  const getBridgeParams = async (role: string) => {
    let res = await queryBridgeParams(role);
    if (res.code == 200) {
      if (role === "RosComu") {
        setRosComuOptions(
          res.result.map((item) => ({
            label: item.name,
            value: item.id,
            useFor: item.useFor,
          }))
        );
      } else {
        setSimTimeClockOptions(
          res.result.map((item) => ({
            label: item.name,
            value: item.id,
            useFor: item.useFor,
          }))
        );
      }
    }
    console.log(res, role);
  };
  const getSimulationDetail = async () => {
    if (id) {
      let res = await querySimulation(id);
      if (res.code === 200) {
        form.setFieldsValue({
          ...res.result,
          map: res.result?.map?.cid,
          cluster: res.result?.cluster?.id,
          timeOfDay: res.result.timeOfDay ? dayjs(res.result.timeOfDay) : null,
        });
        setIsDisabled(res.result.apiOnly);
        setVehicles(
          res.result.vehicles.map((item) => ({
            ...item,
            config: item.config.cid,
            vehicle: item.vehicle.cid,
            vehicleEngineer: item.vehicle.data.vehicleEngineer,
            imageUrl: item.vehicle.data.imageUrl,
            configList: item.configList ? JSON.parse(item.configList) : [],
          }))
        );
      }
      console.log(res, "ss-----");
    }
  };
  const getClusterList = async () => {
    let result = await queryClusterList();
    console.log(result.result, "cluster");

    if (result.code === 200) {
      setClusterOptions(result.result);
    }
  };

  const handleVehicleChange = async (value, index) => {
    const updatedVehicles = [...vehicles];
    const vehicle = vehicleOptions.find((item) => item.value === value);
    let result = await querySensorConfigs(value);
    let configList;
    if (result.code === 200) {
      const list = result.result.map((item) => ({
        label: item.name,
        value: item.cid,
      }));
      configList = list;
    } else {
      configList = [];
    }
    console.log(updatedVehicles[index], "updatedVehicles[index]", vehicles);

    updatedVehicles[index] = {
      ...updatedVehicles[index],
      configList,
      vehicle: value,
      config: null,
      vehicleEngineer: vehicle.vehicleEngineer,
      imageUrl: vehicle.imageUrl,
    };

    console.log(updatedVehicles, "handleVehicleChange=====");

    setVehicles(updatedVehicles);
  };
  const handleConfigChange = (value, index) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index].config = value;
    setVehicles(updatedVehicles);
  };

  const addVehicle = () => {
    console.log("addVehicle", vehicles);
    setVehicles([
      ...vehicles,
      {
        id: vehicles.length + 1,
        vehicle: null,
        config: null,
        configList: [],
        vehicleEngineer: null,
        imageUrl: null,
      },
    ]);
  };
  const deleteVehicle = (index) => {
    const updatedVehicles = [...vehicles];
    // 不设置null，再添加车辆会保留上一次的数据
    form.setFieldValue(`vehicle_${index}`, null);
    form.setFieldValue(`config_${index}`, null);
    updatedVehicles.splice(index, 1);
    setVehicles(updatedVehicles);
  };
  const getVehicleList = async () => {
    let res = await vechilesList();
    console.log(res, "list");

    // let data = await listVehicles();
    let vehicleOptions = res.result.map((vehicle) => ({
      value: vehicle.data.id,
      label: vehicle.data.name,
      vehicleEngineer: vehicle.data.vehicleEngineer,
      imageUrl: vehicle.data.imageUrl,
    }));
    console.log(vehicleOptions, "vehicleOptions===");

    setVehicleOptions(vehicleOptions);
  };
  const getMapList = async () => {
    const data = await listMaps();
    let mapOptions = data.rows.map((map) => ({
      value: map.id,
      label: map.name,
      imageUrl: map.imageUrl,
    }));
    setMapOptions(mapOptions);
  };

  const next = () => {
    form
      .validateFields()
      .then(() => {
        setCurrent(current + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const handlePublish = async () => {
    const values = form.getFieldsValue(true);

    if (values.apiOnly) {
      delete values.map;
      delete values.vehicleId;
      delete values.configId;
    } else {
      // const { day, time } = values;
      // if (day && time) {
      //   const formatedDay = day.format("YYYY/MM/DD");
      //   const formattedTime = time.format("HH:mm");
      //   const dateTimeSelected = dayjs(`${formatedDay} ${formattedTime}`).format("YYYY-MM-DDTHH:mm:ss");
      //   values.timeOfDay = dateTimeSelected;
      // }
      values.apiOnly = false;
      values.vehicles = vehicles.map((vehicle, index) => {
        return {
          vehicleId: vehicle.vehicle,
          configId: vehicle.config,
          configList: JSON.stringify(vehicle.configList),

          bridge: {
            type: values[`autopilot-${index}`],
            connectionString: values[`bridgeConnection-${index}`],
            RosComu: values[`RosComu-${index}`],
            SimTimeClock: values[`SimTimeClock-${index}`],
          },
        };
      });

      console.log(values, "values22222", vehicles);
    }

    if (id) {
      let result = await updateSimulation(values);
      if (result.code === 200) {
        messageApi.open({
          type: "success",
          content: "发布成功",
        });
        navigate(`/simulations/${result.msg}`, { replace: true });
      }
    } else {
      let result = await addSimulation(values);
      if (result.code === 200) {
        messageApi.open({
          type: "success",
          content: "发布成功",
        });
        navigate(`/simulations/${result.msg}`, { replace: true });
      }
    }
  };

  const handleCreateTestReport = (e: boolean) => {
    if (e) {
      const randomId = generateRandomID();
      form.setFieldValue("testid", randomId);
    } else {
      form.setFieldValue("testid", null);
    }
  };
  const generateRandomID = () => {
    // 定义可用的字母和数字字符
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let id = "";

    // 生成5位随机ID
    for (let i = 0; i < 5; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
  };
  const setApiOnly = (e: boolean) => {
    setIsDisabled(e);
  };
  const onChange: InputNumberProps["onChange"] = (value) => {
    if (isNaN(value as number)) {
      return;
    }
    setInputValue(value as number);
  };
  return (
    <Layout>
      <Navigation />
      {contextHolder}
      <div className="p-10">
        <div className="w-1/2 m-auto">
          <Steps current={current} items={items} />
        </div>
        <Form layout="vertical" form={form}>
          <div className="content p-5">
            {current === 0 && (
              <div>
                <Form.Item label="仿真名称" name="name" rules={[{ required: true, message: "请输入仿真名称" }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="描述" name="description">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="请选择集群" name="cluster" rules={[{ required: true, message: "请选择集群" }]}>
                  <Select placeholder="请选择集群" allowClear>
                    {clusterOptions.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="创建测试报告" name="testreport" layout="horizontal" valuePropName="checked">
                  <Switch onChange={(e) => handleCreateTestReport(e)} />
                </Form.Item>
                <Form.Item label="线框模式" name="wireframeMode" layout="horizontal" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </div>
            )}
            {current === 1 && (
              <div>
                <Form.Item label="选择地图" name="map" rules={[{ required: !isDisabled, message: "请选择地图" }]}>
                  <Select
                    options={mapOptions}
                    allowClear={true}
                    placeholder="请选择地图"
                    disabled={isDisabled}
                  ></Select>
                </Form.Item>
                {vehicles.map((item, index) => (
                  <div key={item.vehicle}>
                    <div className="flex relative w-full">
                      <Form.Item
                        label="选择车辆"
                        name={`vehicle_${index}`}
                        style={{ marginBottom: "6px", marginRight: "28px" }}
                        className="w-full"
                        rules={[{ required: !isDisabled, message: "请选择车辆" }]}
                      >
                        <Select
                          options={vehicleOptions}
                          placeholder="请选择车辆"
                          onChange={(value) => handleVehicleChange(value, index)}
                          disabled={isDisabled}
                          value={item.vehicle}
                          className="w-full"
                        ></Select>
                      </Form.Item>
                      {index !== 0 && (
                        <MinusCircleOutlined
                          style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "5px" }}
                          onClick={() => deleteVehicle(index)}
                          className="absolute bottom-3 right-0"
                        />
                      )}
                    </div>

                    <div className="flex pl-3 items-start">
                      <MergeOutlined
                        style={{ fontSize: "20px", fontWeight: "bold", marginRight: "5px", marginTop: "3px" }}
                      />
                      <Form.Item
                        label=""
                        className="w-full"
                        rules={[{ required: !isDisabled, message: "请选择传感器配置" }]}
                        name={`config_${index}`}
                      >
                        <Select
                          placeholder="请选择传感器配置"
                          options={item.configList}
                          disabled={isDisabled || !item.vehicle}
                          value={item.config}
                          onChange={(value) => handleConfigChange(value, index)}
                        ></Select>
                      </Form.Item>
                    </div>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={addVehicle}>
                    + 添加另外一个车辆
                  </Button>
                </Form.Item>
                <div className="text-lg mb-3">时间和天气</div>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="仿真时间" name="timeOfDay">
                      <DatePicker disabled={isDisabled} showTime placeholder="选择时间" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Row className="flex items-center">
                      <Col span={12}>
                        <Form.Item label="雨密集程度" name="rain">
                          <Slider
                            min={0}
                            max={1}
                            onChange={onChange}
                            value={typeof inputValue === "number" ? inputValue : 0}
                            step={0.01}
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="" name="rain">
                          <InputNumber
                            min={1}
                            max={20}
                            style={{ margin: "0 16px" }}
                            value={inputValue}
                            onChange={onChange}
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row className="flex items-center">
                      <Col span={12}>
                        <Form.Item label="雾密集程度" name="fog">
                          <Slider
                            min={0}
                            max={1}
                            onChange={onChange}
                            value={typeof inputValue === "number" ? inputValue : 0}
                            step={0.01}
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="" name="fog">
                          <InputNumber
                            min={1}
                            max={20}
                            style={{ margin: "0 16px" }}
                            value={inputValue}
                            onChange={onChange}
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Row className="flex items-center">
                      <Col span={12}>
                        <Form.Item label="路面潮湿程度" name="wetness">
                          <Slider
                            min={0}
                            max={1}
                            onChange={onChange}
                            value={typeof inputValue === "number" ? inputValue : 0}
                            step={0.01}
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="" name="wetness">
                          <InputNumber
                            min={1}
                            max={20}
                            style={{ margin: "0 16px" }}
                            value={inputValue}
                            onChange={onChange}
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row className="flex items-center">
                      <Col span={12}>
                        <Form.Item label="云密集程度" name="cloudiness">
                          <Slider
                            min={0}
                            max={1}
                            onChange={onChange}
                            value={typeof inputValue === "number" ? inputValue : 0}
                            step={0.01}
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="" name="cloudiness">
                          <InputNumber
                            min={1}
                            max={20}
                            style={{ margin: "0 16px" }}
                            value={inputValue}
                            onChange={onChange}
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Form.Item
                  label="API only 模式"
                  name="apiOnly"
                  layout="horizontal"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch onChange={(e) => setApiOnly(e)} />
                </Form.Item>
              </div>
            )}
            {current === 2 && (
              <div>
                {vehicles.filter((item) => item.vehicle).length == 0 && (
                  <div className="text-center">API Only模式可直接点击《下一页》</div>
                )}
                {vehicles
                  .filter((item) => item.vehicle)
                  .map((vehicle, index) => (
                    <div key={vehicle.vehicle}>
                      <Row gutter={16}>
                        <Col span={1}>
                          <div className="">主车 {index + 1}</div>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                            label="Autopilot"
                            name={`autopilot-${index}`}
                            rules={[{ required: true, message: "请选择autopilot" }]}
                          >
                            <Select placeholder="请选择 autopilot" options={autopilotOptions}></Select>
                          </Form.Item>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                            label="Bridge Connection"
                            name={`bridgeConnection-${index}`}
                            rules={[{ required: true, message: "请输入Bridge Connection" }]}
                          >
                            <Input placeholder="请输入Bridge Connection" />
                          </Form.Item>
                        </Col>
                      </Row>
                      {vehicle.vehicleEngineer && (
                        <Row gutter={16}>
                          <Col span={1}></Col>
                          {rosComuOptions.find((option) => option.useFor == vehicle.vehicleEngineer) && (
                            <Col span={11}>
                              <Form.Item
                                label="RosComu"
                                name={`RosComu-${index}`}
                                rules={[{ required: true, message: "请选择RosComu" }]}
                              >
                                <Select
                                  placeholder="请选择 autopilot"
                                  options={rosComuOptions.filter((option) => option.useFor == vehicle.vehicleEngineer)}
                                ></Select>
                              </Form.Item>
                            </Col>
                          )}
                          <Col span={11}>
                            <Form.Item
                              label="SimTimeClock"
                              name={`SimTimeClock-${index}`}
                              rules={[{ required: true, message: "请选择SimTimeClock" }]}
                            >
                              <Select placeholder="请选择 autopilot" options={simTimeClockOptions}></Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                    </div>
                  ))}
              </div>
            )}
            {current === 3 && (
              <div className="flex flex-col justify-center items-center">
                {!isDisabled && (
                  <img
                    src={mapOptions.find((map) => map.value == form.getFieldValue("map")).imageUrl}
                    className="w-[640px] rounded-xl"
                  />
                )}
                {!isDisabled && (
                  <div className="flex mt-4">
                    {vehicles.map((item, index) => (
                      <div className="h-20  rounded-full overflow-hidden border-2 border-black mx-2" key={item.id}>
                        <img src={item.imageUrl} className="max-h-full  max-w-none" />
                      </div>
                    ))}
                  </div>
                )}
                {/* <div className="img-container w-full h-96 bg-sky-500 rounded-md"></div> */}
                <p className="text-slate-300 my-5">要运行这个仿真,你必须先发布。</p>
              </div>
            )}
          </div>
        </Form>
        <div className="mt-6 flex justify-center">
          {current > 0 && current < steps.length - 1 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()} className="float-left">
              上一页
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()} className="float-right">
              下一页
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => handlePublish()} className="m-auto w-40" size="large" danger>
              发布
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default NewSimulation;
