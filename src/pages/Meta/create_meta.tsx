import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Space, Table, Tag, Button, Form, Input, Radio, Select, message, Steps, theme, Divider, Flex, Card, InputNumber, } from 'antd';
import _ from 'lodash';
import axios from "axios";
import { handleResponse } from "../../api/Message";
import qs from 'qs';

const Create = () => {

    const navigate = useNavigate();
    const params = useParams();
    const [form] = Form.useForm();
    const [DBType, _DBType] = useState('');
    const [loading, _loading] = useState(false);
    const [edit, _edit] = useState(_.includes(useLocation().pathname, 'edit'));
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [catalog, _catalog] = useState([]);
    const [fromState, _fromState] = useState({});
    const [dataSource, _dataSource] = useState([]);
    let detail: any;

    const apiHost = _.get(window, 'apiHost')

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const getCatalogByType = async (type) => {
        _loading(true);
        const res = await axios.get(`${apiHost}/api/v1/catalogs?${qs.stringify({
            type,
            tree: true,
        })}`) as any;
        handleResponse(res, true);
        _loading(false);
        _catalog(res?.data?.data)
    }

    const steps = [
        {
            title: '创建模型',
            content: <div>
                <Form
                    {...layout}
                    form={form}
                    name="wrap"
                    labelAlign="right"
                    labelWrap
                    style={{ maxWidth: 600, margin: '0 auto' }}
                    onFieldsChange={(...args) => _fromState(args[1])}
                >
                    <Form.Item label="名称" name="name" rules={[{ required: true }]}>
                        <Input disabled={loading} />
                    </Form.Item>
                    <Form.Item label="别名" name="cnName" rules={[{ required: true }]}>
                        <Input disabled={loading} />
                    </Form.Item>
                    <Form.Item label="目录层级" name="catalogType" rules={[{ required: true }]} >
                        <Select options={[
                            { label: '原始数据层', value: 'RAW' },
                            { label: '加工数据层', value: 'DW' },
                            { label: '应用数据层', value: 'APP' },
                        ]} onChange={getCatalogByType} disabled={loading} />
                    </Form.Item>
                    <Form.Item label="目录" name="catalogId" rules={[{ required: true }]}>
                        <Select options={catalog} disabled={!catalog?.length || loading} fieldNames={{
                            label: 'name',
                            value: 'id',
                        }} loading={loading} />
                    </Form.Item>
                    {
                        _.find(fromState, { name: ['catalogType'] })?.value == 'APP' &&
                        <Form.Item label="存储" name="datasourceId" rules={[{ required: true }]}>
                            <Select options={dataSource} fieldNames={{
                                label: 'name',
                                value: 'id',
                            }} disabled={loading} />
                        </Form.Item>
                    }
                    <Form.Item label="模型类型" name="entityType" rules={[{ required: true }]}>
                        <Select options={[
                            { label: '普通模型', value: 'MODEL' },
                            { label: '空间模型', value: 'MODEL_SPATIAL' },
                        ]} disabled={loading} />
                    </Form.Item>
                    {
                        _.find(fromState, { name: ['entityType'] })?.value == 'MODEL_SPATIAL' && <>
                            <Form.Item label="空间参考" name="wkId" rules={[{ required: true }]}>
                                <Select options={[
                                    { label: 'CGCS2000(EPSG:4490)', value: '4490' },
                                    { label: 'WGS 84 / Pseudo-Mercator(EPSG:3857)', value: '3857' },
                                    { label: 'World Geodetic System 1984(EPSG:4326)', value: '4326' },
                                ]} disabled={loading} />
                            </Form.Item>
                            <Form.Item label="空间类型" name="geometryType" rules={[{ required: true }]}>
                                <Select options={[
                                    { label: '点', value: 'Point' },
                                    { label: '线', value: 'LineString' },
                                    { label: '面', value: 'Polygon' },
                                ]} disabled={loading} />
                            </Form.Item>
                        </>
                    }
                </Form>
            </div>,
        },
        {
            title: '模型字段',
            content: <div>

            </div>,
        },
    ];

    const getDetail = async () => {
        const { id } = params;
        const res = await axios.get(`${apiHost}/api/v1/datasources?search=id:${id}`);
        detail = res.data.data.content[0];
        const { name, props } = detail;
        form.setFieldsValue({
            name,
            ...props,
        })
    }

    const getDataSource = async () => {
        const res = await axios.get(`${apiHost}/api/v1/datasources?search=category:APP and type:JDBC`);
        handleResponse(res, true);
        _dataSource(res.data.data.content);
    }

    if (edit) {
        steps.splice(0, 1);
        getDetail();
    }

    useEffect(() => {
        getDataSource();
    }, []);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        padding: 16,
        maxHeight: 'calc(100% - 104px)',
        overflow: 'auto',
    };

    return <div style={{ height: '100%' }} >
        <div style={{ height: '66px', backgroundColor: '#fff', padding: '16px', position: 'relative' }} >
            <div style={{ position: 'absolute', right: '16px', top: '16px' }} >
                <Button onClick={() => navigate(-1)} >返回</Button>
            </div>
        </div>
        <div style={{ margin: '16px', padding: '16px', backgroundColor: '#fff', height: 'calc(100% - 100px)' }} >
            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ marginTop: 24, float: 'right' }}>
                {current < steps.length - 1 && (
                    <Button type="primary" disabled={current == 0} onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current > 0 && (
                    <Button loading={loading} style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" loading={loading} onClick={async () => {
                        const awaitForm = await form.validateFields();
                        const { name, host, port, username, password, database, type, options = '{}', code } = awaitForm;
                        const data = {
                            name,
                            type: DBType,
                            code,
                            category: 'DS',
                            props: {
                                host, port, username, password, database, type, options
                            }
                        };
                        _loading(true);
                        let res;
                        if (edit) {
                            res = await axios.put(`${apiHost}/api/v1/datasources/${detail.id}`, data);
                        } else {
                            res = await axios.post(`${apiHost}/api/v1/datasources`, data);
                        }
                        _loading(false);
                        if (handleResponse(res)) {
                            navigate('/data_source');
                        }
                    }}>
                        提交
                    </Button>
                )}
            </div>
        </div>

    </div>;
};

export default Create;
