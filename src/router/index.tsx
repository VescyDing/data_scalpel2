import { RouteObject } from "react-router-dom";
import { lazy, ReactNode, Suspense } from "react";
import { Spin } from 'antd';
import {
    DatabaseOutlined,
    BankOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";

// 用懒加载实现优化
const Main = lazy(() => import("../pages/Main"));
const DataSource = lazy(() => import("../pages/DataSource"));
const DataSourceCreate = lazy(() => import("../pages/DataSource/create"));
const Meta = lazy(() => import("../pages/Meta"));
const MetaCreate = lazy(() => import("../pages/Meta/create"));
const MetaCreateMeta = lazy(() => import("../pages/Meta/create_meta"));
const MetaCreateUpdate = lazy(() => import("../pages/Meta/create_update"));


// 切换页面会出现闪屏现象
// 解决思路：公共页面不采用懒加载的方式 并在App.tsx去除Suspense的包裹

// 实现懒加载的用Suspense包裹 定义函数
const lazyLoad = (children: ReactNode): ReactNode => {
    return <Suspense fallback={<Spin size="large" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(50%, 50%)' }} />}>{children}</Suspense>;
};

export const routers: Array<RouteObject & { icon?: any, label?: string, hidden?: boolean }> = [
    {
        path: "/",
        element: lazyLoad(<Main />),
        icon: <BankOutlined />,
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
        icon: <DatabaseOutlined />,
        label: "数据源管理",

    },
    {
        path: "/data_source/create",
        element: lazyLoad(<DataSourceCreate />),
        hidden: true,
    },
    {
        path: "/data_source/edit/:id",
        element: lazyLoad(<DataSourceCreate />),
        hidden: true,
    },
    {
        path: "/meta",
        element: lazyLoad(<Meta />),
        icon: <AppstoreOutlined />,
        label: "资产管理",
    },
    {
        path: "/meta/create",
        element: lazyLoad(<MetaCreate />),
        hidden: true,
    },
    {
        path: "/meta/edit/:id",
        element: lazyLoad(<MetaCreate />),
        hidden: true,
    },
    {
        path: "/meta/create_meta",
        element: lazyLoad(<MetaCreateMeta />),
        hidden: true,
    },
    {
        path: "/meta/create_update",
        element: lazyLoad(<MetaCreateUpdate />),
        hidden: true,
    },
];
