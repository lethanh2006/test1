import { genExcelFile } from '@/utils/utils';
import { ArrowLeftOutlined, CheckCircleOutlined, DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Popconfirm, Row, Space, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ButtonExtend from '../ButtonExtend';
import TableStaticData from '../TableStaticData';
import type { IColumn, TImportHeader, TImportResponse, TImportRowResponse } from '../typing';

const ValidateDataImport = (props: {
	onOk?: () => void;
	onCancel: () => void;
	onBack: any;
	modelName: any;
	importHeaders: TImportHeader[];
}) => {
	const intl = useIntl();
	const { onOk, onCancel, onBack, modelName, importHeaders } = props;
	const { dataImport, startLine } = useModel('import');
	const { postValidateModel, postExecuteImpotModel, formSubmiting } = useModel(modelName) as any;
	const [importResponses, setImportResponses] = useState<TImportRowResponse[]>([]);
	const [errorCount, setErrorCount] = useState<number>();
	const [isError, setIsError] = useState<boolean>();
	const [step, setStep] = useState(0);

	const columns: IColumn<TImportRowResponse>[] = [
		{
			title: intl.formatMessage({ id: 'global.table.import.validate.table.thutuhang' }),
			dataIndex: 'rowIndex',
			width: 80,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'global.table.import.validate.table.trangthai' }),
			width: 120,
			align: 'center',
			render: (val, rec) =>
				!!rec.rowErrors?.length ? (
					<Tag color='red'>
						{step === 0
							? intl.formatMessage({ id: 'global.table.import.validate.table.khonghople' })
							: intl.formatMessage({ id: 'global.table.import.validate.table.khongthanhcong' })}
					</Tag>
				) : (
					<Tag color='green'>
						{step === 0
							? intl.formatMessage({ id: 'global.table.import.validate.table.hople' })
							: intl.formatMessage({ id: 'global.table.import.validate.table.thanhcong' })}
					</Tag>
				),
		},
	];

	const validateData = async () => {
		if (postValidateModel)
			postValidateModel(dataImport)
				.then((res: TImportResponse) => {
					setErrorCount(res.validate?.filter((item) => !!item.rowErrors?.length).length);
					setIsError(res.error);
					const temp = res.validate?.map((item) => ({ ...item, rowIndex: item.index + startLine }));
					setImportResponses(temp ?? []);
				})
				.catch((err: any) => console.log(err));
	};

	useEffect(() => {
		validateData();
	}, []);

	const onExecute = () => {
		postExecuteImpotModel(dataImport)
			.then((res: TImportResponse) => {
				setStep(1);
				setErrorCount(res.validate?.filter((item) => !!item.rowErrors?.length).length);
				setIsError(res.error);
				const temp = res.validate?.map((item) => ({ ...item, rowIndex: item.index + startLine }));
				setImportResponses(temp ?? []);
			})
			.catch((err: any) => console.log(err));
	};

	const transformDataToExcelFormat = () => {
		const headers = [
			intl.formatMessage({ id: 'global.table.import.validate.excel.thutuhang' }),
			...importHeaders.map((h) => h.label),
			intl.formatMessage({ id: 'global.table.import.validate.excel.thongtinloi' }),
		];

		const dataRows = importResponses.map((item) => {
			const { row, rowErrors = [] }: { row: Record<string, any>; rowErrors?: string[] } = item;

			return [
				row.row ?? '',
				...importHeaders.map((h) => row[h.field] ?? ''),
				rowErrors.length > 0 ? rowErrors.join(', ') : '',
			];
		});

		return [headers, ...dataRows];
	};

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<div className='fw500'>{intl.formatMessage({ id: 'global.table.import.validate.ketqua' })}</div>
				<i>{intl.formatMessage({ id: 'global.table.import.validate.dulieu' })}</i>
				<br />

				{importResponses.length ? (
					<ButtonExtend
						size='small'
						icon={<DownloadOutlined />}
						onClick={() => genExcelFile(transformDataToExcelFormat(), 'Kết quả Import.xlsx')}
						loading={formSubmiting}
					>
						{intl.formatMessage({ id: 'global.table.import.validate.button.taixuong' })}
					</ButtonExtend>
				) : null}
			</Col>

			{!formSubmiting ? (
				errorCount ? (
					<Col span={24}>
						{step === 0 ? (
							<>
								<span className='fw500'>{intl.formatMessage({ id: 'global.table.import.validate.hientaico' })}</span>
								<Tag color='red'>
									{errorCount} {intl.formatMessage({ id: 'global.table.import.validate.dongkhonghople' })}
								</Tag>
								<br />
								{intl.formatMessage({ id: 'global.table.import.validate.kiemtralaidulieu' })}
								{/* Bạn có thể kiểm tra lại trước khi Lưu dữ liệu vào hệ thống! */}
							</>
						) : (
							<>
								<span className='fw500'>{intl.formatMessage({ id: 'global.table.import.validate.thuchienluu' })}</span>
								<Tag color='red'>
									{errorCount} {intl.formatMessage({ id: 'global.table.import.validate.dongkhongthanhcong' })}
								</Tag>
							</>
						)}
					</Col>
				) : !isError ? (
					<Col span={24}>
						<Space
							style={{ marginTop: 12, marginBottom: 12, justifyContent: 'center', width: '100%' }}
							align='center'
							className='text-success'
						>
							<CheckCircleOutlined style={{ fontSize: 24 }} />
							<span className='fw500' style={{ fontSize: 18 }}>
								{intl.formatMessage(
									{ id: 'global.table.import.result' },
									{
										count: importResponses.length,
										status: intl.formatMessage({
											id: step === 0 ? 'global.table.import.status.validated' : 'global.table.import.status.saved',
										}),
									},
								)}
							</span>
						</Space>
					</Col>
				) : (
					<Col span={24}>
						<div className='text-error'>{intl.formatMessage({ id: 'global.table.import.validate.error' })}</div>
					</Col>
				)
			) : (
				<div style={{ width: '100%', textAlign: 'center', marginTop: 12, marginBottom: 12 }}>
					<Spin spinning />
				</div>
			)}

			{importResponses.length ? (
				<Col span={24}>
					<Collapse defaultActiveKey={errorCount ? 1 : undefined}>
						<Collapse.Panel
							key={0}
							header={intl.formatMessage(
								{ id: 'global.table.import.validate.thanhcong' },
								{
									count: importResponses.length - (errorCount ?? 0),
								},
							)}
						>
							<TableStaticData
								columns={columns}
								data={importResponses.filter((item) => !item?.rowErrors?.length)}
								loading={formSubmiting}
								size='small'
								hasTotal
							/>
						</Collapse.Panel>
						<Collapse.Panel
							key={1}
							header={intl.formatMessage(
								{ id: 'global.table.import.validate.thatbai' },
								{
									count: errorCount,
								},
							)}
						>
							<TableStaticData
								columns={[
									...columns,
									{
										dataIndex: 'rowErrors',
										title: intl.formatMessage({ id: 'global.table.import.validate.excel.thongtinloi' }),
										width: 350,
										render: (val) => val?.join(', '),
									},
								]}
								data={importResponses.filter((item) => item.rowErrors?.length)}
								loading={formSubmiting}
								size='small'
								hasTotal
							/>
						</Collapse.Panel>
					</Collapse>
				</Col>
			) : null}

			<Col span={24}>
				<Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
					<Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
						{intl.formatMessage({ id: 'global.table.import.math.button.quaylai' })}
					</Button>

					{step === 0 ? (
						<Popconfirm
							title={
								errorCount ? (
									<>
										{intl.formatMessage({ id: 'global.table.import.validate.popconfirm' })}
										<br />
										{intl.formatMessage({ id: 'global.table.import.validate.popconfirm1' })}
									</>
								) : (
									intl.formatMessage({ id: 'global.table.import.validate.popconfirm2' })
								)
							}
							onConfirm={onExecute}
							// disabled={isError || !!errorCount}
						>
							<Button
								htmlType='submit'
								type='primary'
								loading={formSubmiting}
								icon={<SaveOutlined />}
								// disabled={isError || !!errorCount}
							>
								{intl.formatMessage({ id: 'global.table.import.validate.button.luudulieu' })}
							</Button>
						</Popconfirm>
					) : (
						<Button
							onClick={() => {
								if (onOk) onOk(); // Get data
								onCancel();
							}}
						>
							{intl.formatMessage({ id: 'global.table.import.validate.button.hoanthanh' })}
						</Button>
					)}
				</Space>
			</Col>
		</Row>
	);
};

export default ValidateDataImport;
