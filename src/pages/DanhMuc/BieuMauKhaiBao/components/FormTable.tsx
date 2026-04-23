import FormRender from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormRender';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { useIntl, useModel } from '@umijs/max';
import { Button, Form, message, Row } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
	cauHinh: BieuMau.TruongThongTin | BieuMau.Cot;
	onCancel: any;
	edit: boolean;
	isView?: boolean;
	record: any;
}

const FormTable = ({ cauHinh, onCancel, edit, isView, record }: IProps) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const [formValues, setFormValues] = useState<any>({});
	const { recordQuyTrinhForm, setRecordQuyTrinhForm } = useModel('danhmuc.bieumau');

	useEffect(() => {
		if (record) {
			form.setFieldsValue(record);
		}
	}, [record?.index]);

	return (
		<>
			<Form
				disabled={isView}
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				labelCol={{ span: 24 }}
				form={form}
				onFinish={async (values) => {
					const record: any = recordQuyTrinhForm || {};
					for (const item in values) {
						const value = values[item];
						if (value?.fileList?.length) {
							values[item] = await buildUpLoadMultiFile(values, item);
						}
					}

					if (edit) {
						const index = record?.thongTinKhaiBao?.[cauHinh.ma]?.map((item: any) => item.index).indexOf(record.index);
						const list = [...(record?.thongTinKhaiBao?.[cauHinh.ma] ?? [])];
						list.splice(index, 1, { ...record, ...values });

						setRecordQuyTrinhForm({
							...record,
							thongTinKhaiBao: { ...record.thongTinKhaiBao, [cauHinh.ma]: list },
						});
					} else {
						const length = record?.thongTinKhaiBao?.[cauHinh.ma]?.length;
						setRecordQuyTrinhForm({
							...record,
							thongTinKhaiBao: {
								...record.thongTinKhaiBao,
								[cauHinh.ma]: [
									...(record?.thongTinKhaiBao?.[cauHinh.ma] ?? []),
									{ ...values, index: length ? length + 1 : 1 },
								],
							},
						});
					}
					message.success(
						edit
							? intl.formatMessage({ id: 'bieumaukhaibao.suathanhcong' })
							: intl.formatMessage({ id: 'bieumaukhaibao.themmoithanhcong' }),
					);
					onCancel();
				}}
			>
				<Row gutter={[12, 0]}>
					{cauHinh?.danhSachCot?.map((item) => (
						<FormRender
							danhSachCauHinh={cauHinh?.danhSachCot ?? []}
							form={form}
							formValues={formValues}
							key={item.ma}
							cauHinh={item}
						/>
					))}
				</Row>
				<div className='form-footer'>
					{!isView && (
						<Button htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'bieumaukhaibao.them' })
								: intl.formatMessage({ id: 'bieumaukhaibao.luulai' })}
						</Button>
					)}
					{!isView && <Button onClick={() => onCancel()}>{intl.formatMessage({ id: 'bieumaukhaibao.dong' })}</Button>}
				</div>
			</Form>
			{isView && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button onClick={() => onCancel()}>{intl.formatMessage({ id: 'bieumaukhaibao.dong' })}</Button>
				</div>
			)}
		</>
	);
};

export default FormTable;
