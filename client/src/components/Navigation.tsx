import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between px-3 py-4">
      <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
        返回上一页
      </Button>
    </div>
  );
}

export default Navigation;
