import React from 'react';
import { Space, Table, Tag, Button, Form, Input, Radio, Modal, Tree } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useState, useEffect } from "react";
import qs from 'qs';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import axios from 'axios';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { handleResponse } from "../../api/Message";
import { SizeMe } from 'react-sizeme'

const apiHost = _.get(window, 'apiHost')

interface DataType {
    category: string,
    code: string,
    fullType: string,
    id: string,
    manager: string,
    metric: unknown,
    name: string,
    props: object,
    type: string,
}

interface TableParams {
    pagination: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}

const DataSource = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
            total: 0,
        },
    });
    const navigate = useNavigate()
    let filterData: any[] = [];

    const columns: ColumnsType<DataType> = [
        {
            title: '名称',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: '类型',
            dataIndex: 'type',
        },
        {
            title: '管理员',
            dataIndex: 'manager',
        },
        {
            title: '目录',
            dataIndex: 'category',
        },
        {
            title: 'CODE',
            dataIndex: 'code',
        },
        {
            title: 'FULL_TYPE',
            dataIndex: 'fullType',
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button type='link' onClick={() => navigate(`/data_source/edit/${record.id}`)} >编辑</Button>
                    <Button type='link' onClick={() => Modal.confirm({
                        title: <span>您确定要删除数据源<Tag color="#108ee9" style={{ margin: '0 7px' }} >{record.name}</Tag>吗？</span>,
                        icon: <ExclamationCircleFilled />,
                        content: '此操作不可逆。',
                        okType: 'danger',
                        centered: true,
                        async onOk() {
                            return new Promise((resolve, reject) => {
                                axios.delete(`${apiHost}/api/v1/datasources/${record.id}`).then(res => {
                                    fetchData();
                                    if (handleResponse(res)) {
                                        resolve(res);
                                    } else {
                                        reject(res);
                                    }
                                })
                            }).catch((error) => console.error(error));
                        },
                    })} danger >删除</Button>
                </Space>
            ),
        },
    ];

    const onFormValuesChange = (_changedValues, allValues) => {
        filterData = [];
        _.each(allValues, (value, key) => {
            if (!_.isEmpty(value)) {
                if (_.includes(['name'], key)) {
                    filterData.push(`${key}:*${value}*`)
                } else {
                    filterData.push(`${key}:${value}`)
                }
            }
        })
        if (tableParams.pagination.current == 1) {
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    current: 1,
                    total: 0,
                },
            });
            fetchData();
        } else {
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    current: 1,
                    total: 0,
                },
            });
        }
    };

    const fetchData = async () => {
        setLoading(true);
        const res = await axios.get(`${apiHost}/api/v1/datasources?${qs.stringify({
            limit: (tableParams.pagination.current as number - 1) + ',' + '10',
            search: _.join(filterData, ' and ')
        })}`) as any;
        handleResponse(res, true);
        setData(res.data.data.content);
        setLoading(false);
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: res.data.data.number + 1,
                total: res.data.data.totalElements,
            },
        });
    };



    const fetchData2 = async () => {
        setLoading(true);
        const res = await axios.get(`${apiHost}/api/v1/data-asserts/catalogs`) as any;
        handleResponse(res, true);
        _treeData(res?.data?.data)
        setLoading(false);
    };

    useEffect(() => {
        fetchData2();
        fetchData();
    }, [tableParams.pagination?.current]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<DataType>,
    ) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const [treeData, _treeData] = useState([]);


    const onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };



    return <>
        <div style={{ height: '66px', backgroundColor: '#fff', padding: '16px', position: 'relative' }} >
            <Form
                layout="inline"
                form={form}
                onValuesChange={onFormValuesChange}
                style={{ maxWidth: 'calc(100% - 78px)' }}
            >
                <Form.Item label="名称" name="name">
                    <Input style={{ width: '120px' }} />
                </Form.Item>
                <Form.Item label="类型" name="fullType">
                    <Radio.Group>
                        <Radio.Button value="">全部</Radio.Button>
                        <Radio.Button value="JDBC/MYSQL">JDBC/MYSQL</Radio.Button>
                        <Radio.Button value="JDBC/POSTGRESQL">JDBC/POSTGRESQL</Radio.Button>
                        <Radio.Button value="JDBC/DAMENG">JDBC/DAMENG</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="目录" name="category">
                    <Radio.Group>
                        <Radio.Button value="">全部</Radio.Button>
                        <Radio.Button value="APP">APP</Radio.Button>
                        <Radio.Button value="DS">DS</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {/* <Form.Item label="状态">
                    <Select style={{ width: '80px' }} options={[{ label: '全部', value: '' }]} />
                </Form.Item> */}
            </Form>
            <div style={{ position: 'absolute', right: '16px', top: '16px' }} >
                <Space>
                    <Button type="primary" >从数据源创建模型</Button>
                    <Button type="primary" onClick={() => navigate('/meta/create_meta')} >创建模型</Button>
                    <Button type="primary" onClick={() => navigate('/meta/create_update')} >上传</Button>
                </Space>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100% - 100px)' }} >
            <div style={{ margin: '16px', marginRight: 0, padding: '16px', backgroundColor: '#fff', width: '300px', height: '100%' }} >
                <Tree
                    // checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={treeData}
                    fieldNames={{
                        title: 'name',
                        key: 'id',
                    }}
                />
            </div>
            <SizeMe
                monitorHeight
                noPlaceholder
                refreshMode='debounce'
            >
                {
                    ({ size }) => {
                        const { height = 720 } = size;
                        return <div style={{ margin: '16px', padding: '16px', backgroundColor: '#fff', width: 'calc(100% - 300px)', height: '100%' }} >
                            <Table
                                columns={columns}
                                rowKey="id"
                                dataSource={data}
                                pagination={tableParams.pagination}
                                loading={loading}
                                onChange={handleTableChange as any}
                                scroll={{ y: height as number - 140 }}
                            />
                        </div>
                    }
                }
            </SizeMe>
        </div>
    </>
};

export default DataSource;
