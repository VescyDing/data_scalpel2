import React from 'react';
import { Space, Table, Tag, Button, Form, Input, Radio, Select } from 'antd';
import { useState, useEffect } from "react";
import qs from 'qs';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import axios from 'axios';
import _ from 'lodash';

const apiHost = _.get(window, 'apiHost')

interface DataType {
    name: {
        first: string;
        last: string;
    };
    gender: string;
    email: string;
    login: {
        uuid: string;
    };
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}

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
];

const DataSource = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: [10],
            total: 0,
        },
    });
    let filterData = [];

    const onFormValuesChange = (changedValues, allValues) => {
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

    useEffect(() => {
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
                <Form.Item label="状态">
                    <Select style={{ width: '80px' }} options={[{ label: '全部', value: '' }]} />
                </Form.Item>
            </Form>
            <Button type="primary" style={{ position: 'absolute', right: '16px', top: '16px' }} >搜索</Button>
        </div>
        <div style={{ margin: '16px', padding: '16px', backgroundColor: '#fff' }} >
            <Table
                columns={columns}
                rowKey="id"
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    </>
};

export default DataSource;
