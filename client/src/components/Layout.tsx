import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './layout.module.css';
import { Layout } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
type LayoutProps = {
  children: React.ReactNode;
};

const LayoutWrapper: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const getClassNames = (path: string) => {
    const pathName = location.pathname === '/' ? '/maps' : location.pathname;
    return pathName.startsWith(path) ? { background: '#353e4e', color: '#fff' } : {};
  };
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          paddingTop: '100px',
          paddingRight: '12px',
          paddingLeft: '12px',
        }}
      >
        <div className={styles.menuLi} style={getClassNames('/vehicles')}>
          <Link to='/vehicles'>主车模型</Link>
        </div>
        {/* <div className={styles.menuLi} style={getClassNames("/maps")}>
          <Link to="/maps">地图</Link>
        </div> */}
        <div className={styles.menuLi} style={getClassNames('/simulations')}>
          <Link to='/simulations'>仿真</Link>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ overflow: 'initial' }}>
          <div style={{ background: '#282f3b' }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
