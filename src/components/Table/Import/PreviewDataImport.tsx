import ExpandText from '@/components/ExpandText';
import dayjs from '@/utils/dayjs';
import { ArrowLeftOutlined, QuestionOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import TableStaticData from '../TableStaticData';
import type { IColumn, TImportHeader } from '../typing';

const PreviewDataImport = (props: {
	onChange: () => void;
	onBack: any;
	importHeaders: TImportHeader[];
	extendData?: Record<string, string | number | boolean>;
}) => {
	const intl = useIntl();
	const { onChange, onBack, importHeaders, extendData } = props;
	const { matchedColumns, fileData, setDataImport, dataImport, startLine } = useModel('import');
	const [invalidRows, setInvalidRows] = useState<Set<number>>();
	const [loading, setLoading] = useState(false);
	const invalidText = intl.formatMessage({ id: 'global.table.import.preview.table.invalidText' });

	const columns: IColumn<any>[] = [
		{
			dataIndex: 'row',
			title: intl.formatMessage({ id: 'global.table.import.preview.table.tthang' }),
			width: 80,
			align: 'center',
			onCell: (row) => ({ style: { backgroundColor: row.invalid ? '#ffdada94' : undefined } }),
		},
		...importHeaders?.map((item) => ({
			dataIndex: item.field,
			title: item.label,
			width: item.type === 'String' ? 140 : 90,
			align: (item.type === 'String' ? 'left' : 'center') as any,
			render: (val: any) =>
				val === invalidText ? (
					<i style={{ color: 'red' }}>{val}</i>
				) : item.type === 'Boolean' ? (
					<Checkbox checked={!!val} />
				) : item.type === 'Date' && val ? (
					dayjs(val).format('DD/MM/YYYY')
				) : item.type === 'String' ? (
					<ExpandText>{val}</ExpandText>
				) : (
					val
				),
			onCell: (row: any) => ({ style: { backgroundColor: row.invalid ? '#ffdada94' : undefined } }),
		})),
	];

	const getData = () => {
		if (matchedColumns) {
			setLoading(true);
			const tempData: any = [];
			let tmp;
			const invalids: Set<number> = new Set<number>();

			fileData?.forEach((row, index) => {
				const temp: any = { ...(extendData ?? {}), row: index + startLine };
				let valid = true;

				importHeaders?.every((col) => {
					const content = row[matchedColumns[col.field]]?.toString()?.trim();
					// if (col.required && !content) {
					//   valid = false;
					//   return false;
					// }

					if (content) {
						try {
							switch (col.type) {
								case 'Boolean':
									temp[col.field] = content === 'Có' || content === '1' || content === 'x';
									break;
								case 'Number':
									tmp = content ? Number.parseFloat(content.replace(',', '.')) : null;
									if (Number.isNaN(tmp)) {
										temp[col.field] = invalidText;
										valid = false;
									}
									// Với kiểu số thì làm tròn đến 2 chữ số thập phân ???
									else temp[col.field] = tmp === null ? tmp : Math.round(tmp * 100) / 100;
									break;
								case 'Date':
									let parsedDate: string;

									if (dayjs(content, 'DD/MM/YYYY', true).isValid()) {
										parsedDate = dayjs(content, 'DD/MM/YYYY').toISOString();
									} else if (dayjs(content, 'D/M/YYYY', true).isValid()) {
										parsedDate = dayjs(content, 'D/M/YYYY').toISOString();
									} else if (!isNaN(Number(content))) {
										// Excel serial date → Unix timestamp
										parsedDate = dayjs.unix((Number(content) - 25569) * 86400).toISOString();
									} else if (dayjs(content).isValid()) {
										parsedDate = dayjs(content).toISOString();
									} else {
										parsedDate = invalidText;
									}

									temp[col.field] = parsedDate;
									valid = parsedDate !== invalidText;
									break;

								default:
									temp[col.field] = content?.toString();
									break;
							}
						} catch {
							temp[col.field] = invalidText;
							valid = false;
						}
					}
					return true;
				});

				tempData.push(temp);
				if (!valid) {
					temp.invalid = true;
					invalids.add(temp.row);
				}
			});
			setDataImport(tempData);
			setInvalidRows(invalids);
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, [JSON.stringify(matchedColumns)]);

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<div className='fw500'>{intl.formatMessage({ id: 'global.table.import.preview.danhsacdulieu' })}</div>
				{invalidRows?.size ? (
					<i style={{ color: 'red' }}>
						Có ô chứa dữ liệu không hợp lệ tại các dòng {Array.from(invalidRows).join(', ')} (đã được đánh dấu trong
						bảng), vui lòng kiểm tra lại!
					</i>
				) : null}
			</Col>

			<Col span={24}>
				<TableStaticData
					columns={columns}
					data={dataImport ?? []}
					loading={loading}
					size='small'
					otherProps={{ bordered: true, rowKey: (rec: any) => rec.row }}
					hasTotal
				/>
			</Col>

			<Col span={24}>
				<Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
					<Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
						{intl.formatMessage({ id: 'global.table.import.preview.button.quaylai' })}
					</Button>
					<Button
						htmlType='submit'
						type='primary'
						onClick={() => onChange()}
						icon={<QuestionOutlined />}
						disabled={!dataImport?.length || !!invalidRows?.size}
					>
						{intl.formatMessage({ id: 'global.table.import.preview.button.kiemtra' })}
					</Button>
				</Space>
			</Col>
		</Row>
	);
};

export default PreviewDataImport;
