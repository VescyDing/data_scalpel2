import React from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Spin } from "antd";
import MyHeader from "../Header";
import "./style.css";
import { Link, matchRoutes, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { routers } from '../../router';
import _ from 'lodash';
import { useRoutes, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
    const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([]);
    const [isInit, setIsInit] = useState<boolean>(false)
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate()
    useEffect(() => {
        const routes = matchRoutes(routers, location.pathname); // 返回匹配到的路由数组对象，每一个对象都是一个路由对象
        const pathArr: string[] = [];
        if (routes !== null) {
            routes.forEach((item) => {
                const path = item.route.path;
                if (path) {
                    pathArr.push(path);
                }
            })
        }
        setDefaultSelectedKeys(pathArr);
        setDefaultOpenKeys(pathArr);
        setIsInit(true);
    }, [location.pathname]);
    if (!isInit) {
        return null;
    }

    return (
        <>
            <MyHeader></MyHeader>
            <Layout style={{ height: "calc(100% - 63px)" }}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={collapsed ? {
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                            color: 'rgba(255, 255, 255, 0.87)',
                            marginLeft: '8px',
                        } : {
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                            color: 'rgba(255, 255, 255, 0.87)',
                            marginLeft: '3px',
                        }}
                    />
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        // 根据url地址实现选中高亮
                        defaultSelectedKeys={defaultSelectedKeys}
                        defaultOpenKeys={defaultOpenKeys}
                        items={_.map(routers, router => ({ ...router, key: router.path }))}
                        onClick={(e) => {
                            setDefaultSelectedKeys([e.key]);
                            setDefaultOpenKeys([e.key]);
                            navigate(e.key)
                        }}
                    />
                </Sider>
                <Layout>
                    {/* <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: "16px",
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header> */}
                    <Content
                        style={{
                            margin: 0,
                            padding: 0,
                            minHeight: 280,
                            // background: colorBgContainer,
                        }}
                    >
                        {useRoutes(routers)}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default App;
