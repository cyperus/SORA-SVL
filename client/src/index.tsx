import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Maps from './pages/Maps';
import Vehicles from './pages/Vehicle/Vehicles';
import Plugins from './pages/Plugins';
import Simulations from './pages/Simulation/Simulations';
import VehiclePage from './pages/Vehicle/VehiclePage';
import SensorConfigurationPage from './pages/Vehicle/SensorConfiguration';
import { ConfigProvider, theme } from 'antd';
import NewSimulation from './pages/Simulation/NewSimulation';
import SimulationDetail from './pages/Simulation/SimulationDetail';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: '#131922',
        },
        components: {
          Input: {
            colorBgContainer: '#343c4d',
          },
          InputNumber: {
            colorBgContainer: '#343c4d',
          },
          Select: {
            colorBgContainer: '#343c4d',
          },

          Modal: {
            contentBg: '#282f3b',
            headerBg: '#282f3b',
          },
        },
      }}
    >
      <Routes>
        <Route path='/' element={<Maps />} />
        <Route path='maps' element={<Maps />} />
        <Route path='vehicles' element={<Vehicles />} />
        <Route path='vehicles/:cid' element={<VehiclePage />} />
        <Route path='vehicles/:cid/sensor-configuration/:sid' element={<SensorConfigurationPage />} />
        <Route path='plugins' element={<Plugins />} />
        <Route path='simulations' element={<Simulations />} />
        <Route path='simulations/new' element={<NewSimulation />} />
        <Route path='simulations/new/:id' element={<NewSimulation />} />
        <Route path='simulations/:id' element={<SimulationDetail />} />
      </Routes>
    </ConfigProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
