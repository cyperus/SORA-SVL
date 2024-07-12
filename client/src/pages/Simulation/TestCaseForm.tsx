import { Checkbox, Col, Form, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { listMaps, listVehicles } from "../../api/vehicle";
const { Option } = Select;

function TestCaseForm() {
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [mapOptions, setMapOptions] = useState([]);
  useEffect(() => {
    getVehicleList();
    getMapList();
  }, []);
  const getVehicleList = async () => {
    let data = await listVehicles();
    let vehicleOptions = data.rows.map((vehicle) => ({
      value: vehicle.id,
      label: vehicle.name,
    }));
    setVehicleOptions(vehicleOptions);
  };
  const getMapList = async () => {
    const data = await listMaps();
    let mapOptions = data.rows.map((map) => ({
      value: map.id,
      label: map.name,
    }));
    setMapOptions(mapOptions);
  };
  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="选择地图" name="map">
          <Select options={mapOptions} allowClear={true} placeholder="请选择地图"></Select>
        </Form.Item>
        <Form.Item label="选择车辆" name="vehicle">
          <Select options={vehicleOptions} placeholder="请选择车辆"></Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="光照" name="light">
              <Select options={[]} placeholder="请选择照"></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="天气" name="weather">
              <Select options={[]} placeholder="选择天气"></Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="API only 模式" name="api_only" layout="horizontal">
          <Checkbox />
        </Form.Item>
      </Form>
    </div>
  );
}

export default TestCaseForm;
