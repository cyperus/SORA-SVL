import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Select } from "antd";

const { Option } = Select;
type FieldType = {
  name: string;
  description: string;
  cluster: string;
  wireframe: boolean;
};

function GeneralForm() {
  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="仿真名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="请选择集群" name="cluster">
          <Select placeholder="请选择集群" allowClear>
            <Option value="male">No bridge</Option>
            <Option value="female">ROS2</Option>
            <Option value="other">Logging</Option>
          </Select>
        </Form.Item>
        <Form.Item label="创建测试报告" name="testreport" layout="horizontal" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="线框模式" name="wireframe" layout="horizontal" valuePropName="checked">
          <Checkbox />
        </Form.Item>
      </Form>
    </div>
  );
}

export default GeneralForm;
