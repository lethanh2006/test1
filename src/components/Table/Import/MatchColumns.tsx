import rules from '@/utils/rules';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { type TImportHeader } from '../typing';

const MatchColumns = (props: { onChange: () => void; onBack: any; importHeaders: TImportHeader[] }) => {
	const intl = useIntl();
	const { onChange, onBack, importHeaders } = props;
	const { headLine, matchedColumns, setMatchedColumns } = useModel('import');
	const [form] = Form.useForm();

	useEffect(() => {
		if (matchedColumns) form.setFieldsValue(matchedColumns);
		else {
			const fileTitles = Object.values(headLine ?? {}); // Các tiêu đề cột lấy từ file
			const initialValues = importHeaders.reduce<Record<string, any>>((acc, col) => {
				acc[col.field] = fileTitles.includes(col.label) ? col.label : undefined; // Nếu tiêu đề cột trong file trùng với tiêu đề cột đã định nghĩa thì gán giá trị, nếu không thì để undefined
				return acc;
			}, {});
			form.setFieldsValue(initialValues);
		}
	}, [JSON.stringify(headLine)]);

	const onFinish = (values: any): void => {
		setMatchedColumns(values);
		if (onChange) onChange();
	};

	return (
		<Form layout='vertical' form={form} onFinish={onFinish}>
			<Row gutter={[12, 0]}>
				<Col span={24} className='fw500' style={{ marginBottom: 12 }}>
					{intl.formatMessage({ id: 'global.table.import.math.ghepcot' })}
				</Col>
				{importHeaders?.map((col) => (
					<Col span={24} md={12} key={col.field}>
						<Form.Item name={col.field} label={col.label} rules={[...(col.required ? rules.required : [])]}>
							<Select
								options={Object.entries(headLine ?? {}).map(([colName, title]) => ({
									value: title,
									key: colName,
									label: `Cột ${colName}: ${title}`,
								}))}
								style={{ width: '100%' }}
								allowClear={!col.required}
								placeholder={intl.formatMessage({ id: 'global.table.import.math.placeholder' })}
								optionFilterProp='label'
								showSearch
							/>
						</Form.Item>
					</Col>
				))}
				<Col span={24}>
					<i style={{ color: 'red' }}>{intl.formatMessage({ id: 'global.table.import.math.thongtin' })}</i>
				</Col>

				<Col span={24}>
					<Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
						<Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
							{intl.formatMessage({ id: 'global.table.import.math.button.quaylai' })}
						</Button>
						<Button htmlType='submit' type='primary'>
							{intl.formatMessage({ id: 'global.table.import.math.button.tieptheo' })} <ArrowRightOutlined />
						</Button>
					</Space>
				</Col>
			</Row>
		</Form>
	);
};

export default MatchColumns;
