import { RouteObject } from "react-router-dom";
import { lazy, ReactNode, Suspense } from "react";
import { Spin } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import Login from "../pages/Login";

// 用懒加载实现优化
const Main = lazy(() => import("../pages/Main"));
const DataSource = lazy(() => import("../pages/DataSource"));

// 切换页面会出现闪屏现象
// 解决思路：公共页面不采用懒加载的方式 并在App.tsx去除Suspense的包裹

// 实现懒加载的用Suspense包裹 定义函数
const lazyLoad = (children: ReactNode): ReactNode => {
    return <Suspense fallback={<Spin size="large" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(50%, 50%)' }} />}>{children}</Suspense>;
};

export const routers: Array<RouteObject & { icon: any, label: string }> = [
    {
        path: "/",
        element: lazyLoad(<Main />),
        icon: <UserOutlined />,
        label: "首页",
    },
    // {
    //     path: "/login",
    //     element: <Login />,
    //     icon: <VideoCameraOutlined />,
    //     label: "登陆",
    // },
    {
        path: "/data_source",
        element: lazyLoad(<DataSource />),
        icon: <UploadOutlined />,
        label: "数据源管理",
    },
];
