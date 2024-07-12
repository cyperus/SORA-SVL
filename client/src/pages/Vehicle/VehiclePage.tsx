import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Select, message, Table, Space, Popconfirm, Button } from 'antd';
import type { FormProps, PopconfirmProps } from 'antd';
import { SettingFilled, EditOutlined, DeleteOutlined, CopyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Layout from '../../components/Layout';
import { Vehicle } from '../../utils/types';
import { addSensorConfig, deleteSensorConfig, queryBridges, querySensorConfigs } from '../../api/car';

const { Option } = Select;
function VehiclePage() {
  const location = useLocation();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [sensorConfigs, setSensorConfigs] = useState([]);
  const [bridgeOptions, setBridgeOptions] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '拥有者',
      dataIndex: 'owner',
      render: (record) => (
        <div>
          {record.firstName}&nbsp;
          {record.lastName}
        </div>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <EditOutlined className='cursor-pointer' onClick={() => handleEditConfig(record)} />
          <CopyOutlined className='cursor-pointer' onClick={() => handleCopyID(record.id)} />
          <Popconfirm okText='确认' title='确认删除该配置吗?' cancelText='取消' onConfirm={() => handleDeleteConfig(record.id)}>
            <DeleteOutlined className='cursor-pointer' />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/v1${location.pathname}`);
      const data = await res.json();
      setVehicle(data as Vehicle);
    };
    console.log(location);

    fetchData();
    getBridges();
    getSensorConfigs();
  }, []);
  const getBridges = async () => {
    let data = await queryBridges();
    if (data.code === 200) {
      const list = data.result.map((item) => ({
        value: item,
        label: item,
      }));
      setBridgeOptions(list);
    }
    console.log(data, 'data');
  };
  const getSensorConfigs = async () => {
    const id = location.pathname.split('/').slice(-1)[0];
    let data = await querySensorConfigs(id);
    if (data.code === 200) {
      const list = data.result.map((item) => ({
        name: item.data.name,
        owner: item.data.owner,
        id: item.cid,
      }));
      console.log(list, 'list');

      setSensorConfigs(list);
    }
    console.log(data, 'data');
  };
  const validateJSON = (jstring) => {
    try {
      JSON.parse(jstring);
      return true;
    } catch {
      return false;
    }
  };

  const onAddNewConfig = async (values) => {
    console.log(values, 'values=');
    if (values === '') {
      messageApi.open({
        type: 'error',
        content: 'Empty Config!',
      });
    } else {
      const { name, bridgeName } = values;
      const obj = {
        vehicleId: vehicle.id,
        name,
        bridgeName,
      };
      let result = await addSensorConfig(obj);
      if (result.code == 200) {
        navigate(`/vehicles/${vehicle.id}/sensor-configuration/${result.msg}`);
      }

      setShowOverlay(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setShowOverlay(false);
  };
  const handleEditConfig = (row) => {
    navigate(`/vehicles/${vehicle.id}/sensor-configuration/${row.id}`);

    console.log(row, 'row---');
  };
  const handleDeleteConfig = async (id: string) => {
    let res = await deleteSensorConfig(id);
    console.log(res, 'res----');
    if (res.code === 200) {
      messageApi.open({
        type: 'success',
        content: '删除成功',
      });
      getSensorConfigs();
    }
  };
  const handleCopyID = (id: string) => {
    navigator.clipboard.writeText(id);
    console.log(id);
  };
  return (
    <Layout>
      <div className='flex justify-between px-3 py-4 sticky top-0' style={{ backgroundColor: '#282f3b', zIndex: 10 }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          返回上一页
        </Button>
      </div>
      {contextHolder}
      {/* ACTUAL CONTENT */}
      {vehicle && (
        <div className='w-full h-full p-8 space-y-4 z-10'>
          <div className='flex'>
            <div className='mr-10'>
              <h1 className='text-4xl font-bold mb-4'>{vehicle.name}</h1>
              <img src={`${vehicle.imageUrl}`} />
            </div>
            <div className='mt-12'>
              <p className='text-2xl mb-4'>Information</p>
              <p className='text-lg mb-2'>Owner: {`${vehicle?.owner?.firstName} ${vehicle?.owner?.lastName}`}</p>
              <p className='text-lg mb-2'>Status: {vehicle.accessType}</p>
              <p className='text-lg mb-2'>License: {vehicle.licenseName}</p>
              <p className='text-lg mb-2'>Copywright: {vehicle.copyright}</p>
            </div>
          </div>

          <div>
            <div className='flex justify-between'>
              <p className='font-bold py-2 '>Sensor Configurations ({sensorConfigs.length}) </p>
              <div className='cursor-pointer' onClick={() => setShowOverlay(true)}>
                <SettingFilled style={{ fontSize: 20 }} />
              </div>
            </div>
            <Table columns={columns} rowKey='id' dataSource={sensorConfigs}></Table>
          </div>
        </div>
      )}
      <Modal
        title='传感器配置'
        open={showOverlay}
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={handleCancel}
        okText='保存'
        cancelText='取消'
        destroyOnClose
        modalRender={(dom) => (
          <Form layout='vertical' onFinish={(values) => onAddNewConfig(values)} form={form}>
            {dom}
          </Form>
        )}
      >
        <Form.Item label='配置名称' name='name'>
          <Input />
        </Form.Item>
        <Form.Item label='Bridge' name='bridgeName'>
          <Select placeholder='请选择Bridge' allowClear options={bridgeOptions} />
        </Form.Item>
      </Modal>
    </Layout>
  );
}

export default VehiclePage;
