import { message } from 'antd';

const handleResponse = (response: any, notReportSuccess?: boolean) => {
    const code = response.data.code;
    if (code === '200') {
        if (!notReportSuccess) {
            message.success(response.data.message);
        }
        return true;
    } else {
        message.error(response.data.message + response.data.detail);
        return false;
    }
}

export {
    handleResponse
}