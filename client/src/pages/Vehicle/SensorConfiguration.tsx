import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { SensorConfiguration, Vehicle } from "../../utils/types";
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space } from "antd";
import {
  ArrowLeftOutlined,
  CloseOutlined,
  ControlOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import "./sensorConfig.css";
import CarScene from "../../components/CarScene";
import { querySensor, querySensorConfig, updateSensors } from "../../api/car";

const sensorType = {
  LidarSensor: "激光雷达",
  RadarSensor: "毫米波雷达",
  ColorCameraSensor: "彩色相机",
  GpsOdometrySensor: "GPS",
  ImuSensor: "IMU",
};
function SensorConfigurationPage() {
  const location = useLocation();
  const [configId, setConfigId] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [sensorConfiguration, setSensorConfiguration] = useState<SensorConfiguration | null>(null);
  const [form] = Form.useForm();
  const [sensorForm] = Form.useForm();
  const [vehicleForm] = Form.useForm();
  const [paramForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [sensorViewVisible, setSensorViewVisible] = useState(false);
  const [paramViewVisible, setParamViewVisible] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [currentSensor, setCurrentSensor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      const vehiclePath = location.pathname.split("/").slice(0, 3).join("/");
      const sid = location.pathname.split("/").slice(-1)[0];
      console.log(vehiclePath, sid, "vehiclePath, sid");

      const res = await fetch(`/api/v1/${vehiclePath}`);
      const data = await res.json();

      const sensorConfiguration = (data as Vehicle).sensorsConfigurations.find((conf) => conf.id === sid);

      setVehicle(data as Vehicle);
      vehicleForm.setFieldsValue({
        name: data.name,
        description: data.description,
        updatedAt: data.updatedAt,
      });
      setSensorConfiguration(sensorConfiguration as SensorConfiguration);
    };
    // fetchData();
    getCarData();
    // getLidars("LidarSensor");
  }, []);
  async function getCarData() {
    const sid = location.pathname.split("/").slice(-1)[0];
    setConfigId(sid);
    let data = await querySensorConfig(sid);
    if (data.code == 200) {
      // const allKeys = Object.keys(data.result.sensors);
      // const result = allKeys.reduce((acc, key) => {
      //   return [...acc, ...data.result.sensors[key]];
      // }, []);
      setSensors(data.result.sensors);

      const car = data.result.car;
      setVehicle(data.result.car);
      vehicleForm.setFieldsValue({
        name: car.name,
        description: car.data.description,
        updatedAt: car.data.updatedAt,
      });
    }
  }
  //  save sensor transform properties
  function saveSensorTransform() {
    const data = form.getFieldsValue(true);
    console.log(data, "data--transform--", sensors[data.type]);
    setSensors((sensors) => {
      sensors[data.type] = sensors[data.type] || [];
      sensors[data.type].map((item) => {
        if (item.value === data.id) {
          const { x, y, z, pitch, yaw, roll, name } = data;
          item.name = name;
          item.transform = { x, y, z, pitch, yaw, roll };
        }
      });
      return sensors;
    });

    setSensorViewVisible(false);
    setParamViewVisible(false);
  }
  async function getLidars(type: string) {
    const data = await querySensor(type);
    let list = [];
    if (data.code == 200) {
      list = data.result.map((item) => ({
        value: item.id,
        label: item.name,
        name: item.name,
        type: item.type,
        id: item.id,
        sensorParameters: item.sensorParameters,
      }));
      setTypeOptions(list);
    }
  }
  function saveSensorParams() {
    const formValues = paramForm.getFieldsValue();
    console.log(formValues, "saveSensorParams====");

    setCurrentSensor((sensor) => {
      sensor.sensorParameters.forEach((param) => {
        if (formValues.hasOwnProperty(param.name)) {
          param.value = formValues[param.name];
          if (param.name === "postprocessing") {
            const option = param.options.find((item) => item.name === formValues[param.name]);
            if (option) {
              option.links.forEach((link) => {
                link.value = formValues[link.name];
              });
            }
          }
        }
      });

      return sensor;
    });
    setSensors((sensors) => {
      sensors[currentSensor.type] = sensors[currentSensor.type] || [];
      sensors[currentSensor.type].map((item) => {
        if (item.value === currentSensor.id) {
          return currentSensor;
        }
        return item;
      });

      return sensors;
    });
    paramForm.resetFields();
    setParamViewVisible(false);
  }
  // show transform properties
  function showSensorDetail(sensor) {
    console.log(sensor, "------transform");

    setCurrentSensor((sensor) => ({
      ...sensor,
      transform: {
        x: sensor?.transform?.x || 0,
        y: sensor?.transform?.y || 0,
        z: sensor?.transform?.z || 0,
        pith: sensor?.transform?.pith || 0,
        yaw: sensor?.transform?.yaw || 0,
        roll: sensor?.transform?.roll || 0,
      },
    }));
    const data = {
      name: sensor.name,
      owner: sensor.owner,
      id: sensor.id,
      type: sensor.type,
      x: sensor?.transform?.x || 0,
      y: sensor?.transform?.y || 0,
      z: sensor?.transform?.z || 0,
      pith: sensor?.transform?.pith || 0,
      yaw: sensor?.transform?.yaw || 0,
      roll: sensor?.transform?.roll || 0,
    };
    form.setFieldsValue(data);
    setSensorViewVisible(true);
    if (sensorViewVisible) {
      setParamViewVisible(false);
    }
  }
  function addNewSensor(values) {
    const option = typeOptions.find((item) => item.value === values.type);
    option.name = values.name;
    setCurrentSensor(option);
    console.log(option, "option---", sensors);
    if (!sensors[option.type]) {
      sensors[option.type] = [option];
    } else {
      sensors[option.type].push(option);
    }

    setSensors({ ...sensors });
    // setSensors([...sensors, option]);
    closeSensorDialog();
  }
  // 获取selectedSensors
  function openSensorDialog(type?: string) {
    if (type) {
      const encodedType = encodeURIComponent(type);
      getLidars(encodedType);
    }
    setOpen(true);
    setSensorViewVisible(false);
    setParamViewVisible(false);
  }
  function handleDeleteSensor(sensor, key, i) {
    // find which type group the sensor belongs to and remove the sensor based on the index in the group
    sensors[key].splice(i, 1);
    console.log(sensors, "sensors----");

    setSensors({ ...sensors });
    setParamViewVisible(false);
    setSensorViewVisible(false);
    // setSensors(sensors);
  }
  function closeSensorDialog() {
    setOpen(false);
    setTypeOptions([]);
    sensorForm.resetFields();
  }
  // save the whole page aks : sensor configuration
  async function saveSensorConfig() {
    saveSensorTransform();
    saveSensorParams();
    const allKeys = Object.keys(sensors);
    const sensorArr = allKeys.reduce((acc, key) => {
      return [...acc, ...sensors[key]];
    }, []);
    let result = await updateSensors(configId, sensorArr);
    if (result.code === 200) {
      messageApi.open({
        type: "success",
        content: "保存成功",
      });
    }
  }
  function handleOpenParamDialog() {
    if (currentSensor && currentSensor.sensorParameters) {
      currentSensor.sensorParameters.forEach((param) => {
        if (param.options) {
          paramForm.setFieldValue(param.name, param.value ? param.value : param.options[0]);
          if (param.name === "postprocessing") {
            param.options
              .find((option) => option.name == param.value)
              .links.map((link) => {
                paramForm.setFieldValue(link.name, link.value);
              });
            setSelectedOption(param.value);
          }
        } else {
          paramForm.setFieldValue(param.name, param.value);
        }
      });
    }
    setParamViewVisible(!paramViewVisible);
  }
  return (
    <Layout>
      {contextHolder}
      <div className="flex justify-between px-3 py-4 sticky top-0" style={{ backgroundColor: "#282f3b", zIndex: 10 }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          返回上一页
        </Button>
        <Space>
          <Button onClick={() => saveSensorConfig()} type="primary">
            保存
          </Button>
        </Space>
      </div>
      <div className="flex">
        {/* ACTUAL CONTENT */}
        {/* {sensorConfiguration && ( */}
        <div className="">
          <div>
            <div className="config-left p-4 flex items-start relative">
              <div className="vehicleI-info">
                <div className="scrollbar">
                  <div className="title">基本信息</div>
                  {sensorConfiguration && (
                    <div className="flex mb-4">
                      <span className="lable flex-1 flex">传感器配置</span>
                      <span className="value  flex " style={{ flex: 2 }}>
                        {sensorConfiguration.name}
                      </span>
                    </div>
                  )}
                  <Form form={vehicleForm} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} disabled>
                    <Form.Item label="车辆名称" name="name">
                      <Input />
                    </Form.Item>
                    <Form.Item label="备注" name="description">
                      <Input />
                    </Form.Item>
                    <Form.Item label="最近更新" name="updatedAt">
                      <Input />
                    </Form.Item>
                  </Form>
                  {Object.keys(sensorType).map((key, index) => (
                    <div key={key + index}>
                      <div className="sensor flex justify-between">
                        <div>{sensorType[key]}</div>
                        <div className="flex">
                          <PlusCircleOutlined onClick={() => openSensorDialog(key)} />
                        </div>
                      </div>
                      {Object.keys(sensors).includes(key) &&
                        sensors[key].map((sensor, i) => (
                          <div key={sensor.name + i}>
                            <div className="item">
                              <span onClick={() => showSensorDetail(sensor)}>{sensor.name}</span>
                              <DeleteOutlined onClick={() => handleDeleteSensor(sensor, key, i)} />
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
              {sensorViewVisible && (
                <div className="sensor-view">
                  <div className="menu flex items-center justify-between pr-5 my-2">
                    <div className="menu-title" style={{ borderTopWidth: 0 }}>
                      参数编辑
                    </div>
                    <div className="flex items-center">
                      <Button type="primary" htmlType="submit" onClick={() => saveSensorTransform()}>
                        保存
                      </Button>
                      <CloseOutlined className="p-3 cursor-pointer" onClick={() => setSensorViewVisible(false)} />
                    </div>
                  </div>
                  <Form form={form} initialValues={{ x: 0, y: 0, z: 0, pitch: 0, yaw: 0, roll: 0 }}>
                    {/* <Form.Item label="ID" name="id">
                      <Input disabled hidden />
                    </Form.Item> */}
                    <Row>
                      <Form.Item label="名称" name="name">
                        <Input />
                      </Form.Item>
                    </Row>
                    <div className="flex items-start justify-between">
                      <Form.Item label="型号" name="type">
                        <Input disabled />
                      </Form.Item>
                      <ControlOutlined
                        className="p-3"
                        style={{ cursor: "pointer", fontSize: 20 }}
                        onClick={() => handleOpenParamDialog()}
                      />
                    </div>

                    <div className="menu-title">安装位置</div>
                    <Row>
                      <Col span={8}>
                        <Form.Item label="X" name="x" layout="vertical">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Y" name="y" layout="vertical">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Z" name="z" layout="vertical">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="menu-title">姿态旋转角</div>
                    <Row>
                      <Col span={8}>
                        <Form.Item label="pitch" name="pitch" layout="vertical">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="yaw" name="yaw" layout="vertical">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="roll" name="roll" layout="vertical">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}
              {paramViewVisible && (
                <div className="sensor-view overflow-y-scroll" style={{ transform: "translateX(200%)" }}>
                  <div
                    className="flex justify-between items-center pr-5 sticky top-0"
                    style={{ backgroundColor: "#282f3b", zIndex: 10 }}
                  >
                    <div className="title">参数预览</div>
                    <div className="flex">
                      <Button type="primary" htmlType="submit" onClick={() => saveSensorParams()} className="mr-3">
                        保存
                      </Button>
                      <CloseOutlined onClick={() => setParamViewVisible(false)} />
                    </div>
                  </div>
                  <div className="pr-5">
                    <Form form={paramForm}>
                      {/* <div className="menu-title mt-4">基础参数</div> */}
                      {currentSensor &&
                        currentSensor.sensorParameters &&
                        currentSensor.sensorParameters.map((param, index) => {
                          let options = [];
                          if (param.options) {
                            if (param.name === "postprocessing") {
                              options = param.options.map((item) => ({
                                value: item.name,
                                label: `${item.zh}`,
                                links: item?.links,
                              }));
                            } else {
                              options = param.options.map((item) => ({
                                value: item,
                                label: `${item}`,
                              }));
                            }

                            console.log(options, "options====");
                          }

                          return (
                            <div key={param.name + index + param.zh}>
                              <div className="justify-between flex text-sm mt-3">
                                <span style={{ width: "40%", display: "inline-block", fontSize: "12px" }}>
                                  {param.parentName && <span>({param.parentName})-</span>}
                                  {param.zh}
                                </span>
                                {Array.isArray(param.options) ? (
                                  <div className="flex flex-col">
                                    <Form.Item name={param.name}>
                                      <Select
                                        options={options}
                                        disabled={!param.editable}
                                        onChange={(value) => {
                                          setSelectedOption(value);
                                        }}
                                      />
                                    </Form.Item>

                                    {options.map((option) => {
                                      if (!option.links) return null;
                                      return (
                                        <div className="" key={option.name}>
                                          {option.value == selectedOption &&
                                            option.links.map((link) => (
                                              <Form.Item name={link.name} label={link.zh} key={link.name}>
                                                <Input />
                                              </Form.Item>
                                            ))}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-right break-words">
                                    <Form.Item name={param.name}>
                                      <Input addonAfter={param.unit} disabled={!param.editable} value={param.value} />
                                    </Form.Item>
                                  </div>

                                  // <span className="w-[70%] text-right break-words">
                                  //   {param.value}
                                  //   <span className="text-xs">{param.unit}</span>
                                  // </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </Form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* )} */}
        <div className="flex flex-1" style={{ backgroundColor: "#20252d" }}>
          {/* <CarScene /> */}
        </div>
      </div>
      <Modal
        title="新增传感器"
        open={open}
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        onCancel={() => closeSensorDialog()}
        okText="保存"
        cancelText="取消"
        destroyOnClose
        modalRender={(dom) => (
          <Form layout="vertical" onFinish={(values) => addNewSensor(values)} form={sensorForm}>
            {dom}
          </Form>
        )}
      >
        <Form.Item label="名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="型号" name="type">
          <Select placeholder="请选择型号" allowClear options={typeOptions}></Select>
        </Form.Item>
      </Modal>
    </Layout>
  );
}

export default SensorConfigurationPage;
