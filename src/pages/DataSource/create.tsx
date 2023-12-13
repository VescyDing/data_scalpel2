import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Space, Table, Tag, Button, Form, Input, Radio, Select, message, Steps, theme, Divider, Flex, Card, InputNumber, } from 'antd';
import _ from 'lodash';
import svg1 from '../../assets/数据库.svg';
import axios from "axios";
import { handleResponse } from "../../api/Message";

const Create = () => {
    useEffect(() => { }, []);
    const navigate = useNavigate();
    const params = useParams();
    const [form] = Form.useForm();
    const [DBType, _DBType] = useState('');
    const [loading, _loading] = useState(false);
    const [edit, _edit] = useState(_.includes(useLocation().pathname, 'edit'));
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    let detail: any;

    const apiHost = _.get(window, 'apiHost')
    const JDBC = [{
        label: 'JDBC关系数据库',
        value: 'JDBC'
    }];
    const Interface = ['HTTP', 'WMTS', 'FeatureService', 'MapService'];
    const CODEDICT = {
        'JDBC': [
            { label: 'MySQL', value: 'MYSQL' },
            { label: 'PostgreSQL', value: 'POSTGRESQL' },
            { label: 'Oracle', value: 'ORACLE' },
            { label: 'SQLServer', value: 'SQLSERVER' },
        ],
    }

    /* const CODEDICT = {
        'MySQL': [
            { label: 'MYSQL', value: 'MYSQL' },
            { label: 'OCEANBASE_MYSQL', value: 'OCEANBASE_MYSQL' },
        ],
        'PostgreSQL': [
            { label: 'POSTGRESQL', value: 'POSTGRESQL' },
        ],
        'Oracle': [
            { label: 'ORACLE', value: 'ORACLE' },
        ],
        'SQLServer': [
            { label: 'SQLSERVER', value: 'SQLSERVER' },
            { label: 'SDE_POST_GIS,', value: 'SDE_POST_GIS,' },
            { label: 'SDE_POSTGRESQL_ST_GEOMETRY', value: 'SDE_POSTGRESQL_ST_GEOMETRY' },
        ],
        '达梦': [
            { label: 'DAMENG', value: 'DAMENG' },
        ],
        'TDengine': [
            { label: 'TD_ENGINE', value: 'TD_ENGINE' },
            { label: 'TD_ENGINE_RS', value: 'TD_ENGINE_RS' },
        ],
    }
    */

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const steps = [
        {
            title: '选择类型',
            content: <div>
                <Divider orientation="left">关系数据库</Divider>
                <Flex wrap="wrap" gap="large">
                    {_.map(JDBC, (item) => (<Card
                        hoverable
                        style={{ width: 180 }}
                        cover={<img alt="example" src={svg1} style={{ margin: 14, width: 'calc(100% - 28px)' }}
                            onClick={() => {
                                _DBType(item.value);
                                setCurrent(current + 1);
                            }}
                        />}
                    >
                        <Card.Meta title={item.label} />
                    </Card>))}
                </Flex>
                <Divider orientation="left">接口</Divider>
                <Flex wrap="wrap" gap="large">
                    {_.map(Interface, (item: string) => (<Card
                        hoverable
                        style={{ width: 180 }}
                        cover={<img alt="example" src={svg1} style={{ margin: 14, width: 'calc(100% - 28px)' }}
                            onClick={() => {
                                _DBType(item);
                                setCurrent(current + 1);
                            }}
                        />}
                    >
                        <Card.Meta title={item} />
                    </Card>))}
                </Flex>
                <Divider orientation="left">MQ</Divider>
            </div>,
        },
        {
            title: '数据源参数',
            content: <div>
                <Form
                    {...layout}
                    form={form}
                    name="wrap"
                    labelAlign="right"
                    labelWrap
                    style={{ maxWidth: 600, margin: '0 auto' }}
                >
                    <Form.Item label="名称" name="name" rules={[{ required: true }]}>
                        <Input disabled={loading} />
                    </Form.Item>
                    {
                        edit ? null : <>
                            <Form.Item label="简称" name="code" rules={[{ required: true }]} >
                                <Input disabled={loading} />
                            </Form.Item>
                            <Form.Item label="数据库类型" name="type" rules={[{ required: true }]}>
                                <Select options={_.get(CODEDICT, DBType) ?? []} />
                            </Form.Item>
                        </>
                    }
                    <Form.Item label="地址" name="password" rules={[{ required: true }]}>
                        <Input disabled={loading} />
                    </Form.Item>
                    <Form.Item label="端口" name="port" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="数据库" name="database" rules={[{ required: true }]}>
                        <Input disabled={loading} />
                    </Form.Item>
                    <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
                        <Input disabled={loading} />
                    </Form.Item>
                    <Form.Item label="密码" name="password" rules={[{ required: true }]}>
                        <Input.Password disabled={loading} />
                    </Form.Item>
                    <Form.Item label="高级参数" name="options">
                        <Input.TextArea disabled={loading} placeholder="输入Key-Value键值对形式的高级参数，json格式。" />
                    </Form.Item>
                </Form>
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

    if (edit) {
        steps.splice(0, 1);
        getDetail();
    }



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
