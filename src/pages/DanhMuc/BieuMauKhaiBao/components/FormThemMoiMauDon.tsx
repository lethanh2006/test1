import UploadFile from '@/components/Upload/UploadFile';
import TableCauHinh from '@/pages/DanhMuc/BieuMauKhaiBao/components/TableCauHinh';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { removeVietnameseTones, resetFieldsForm } from '@/utils/utils';
import { useIntl, useModel } from '@umijs/max';
import { Button, Card, Form, Input, message, Select } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';

const FormThemMoiMauDon = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { danhSach, loading, record, putModel, getModel, postModel, edit, setVisibleForm, visibleForm } =
		useModel('danhmuc.bieumau');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);
	console.log(record);

	const onFinish = async (values: any) => {
		const listMaCauHinh = edit ? danhSach.filter((item) => item.ma !== record?.ma) : danhSach;

		if (listMaCauHinh?.map((item) => item.ma)?.includes(values?.ma)) {
			message.error(intl.formatMessage({ id: 'bieumaukhaibao.madatontai' }));
			return;
		}

		const resUploadFile: any = await buildUpLoadFile(values, 'fileId', undefined, true);

		const payload: BieuMau.IRecord = {
			...record,
			...values,
			ten: values?.ten,
			ma: values?.ma,
			fileId: resUploadFile
				? typeof resUploadFile === 'string'
					? resUploadFile
					: resUploadFile?.data?.data?.file?._id
				: undefined,
			file: resUploadFile
				? typeof resUploadFile === 'string'
					? (record?.file ?? {})
					: [resUploadFile?.data?.data?.file ?? {}]
				: undefined,
		} as BieuMau.IRecord;

		if (edit) {
			putModel(record?._id ?? '', payload, getModel)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(payload, getModel)
				.then()
				.catch((er) => console.log(er));
		}
		// return;
		// const objFind = arr.find((item) => item.ma === payload?.ma);

		// if (objFind) {
		// 	arr.forEach((item, i) => {
		// 		if (item?.ma === payload?.ma) {
		// 			arr.splice(i, 1, payload);
		// 		}
		// 	});
		// } else {
		// 	arr?.push(payload as BieuMau.IRecord);
		// }

		// setDanhSach(arr);

		// setVisibleForm(false);
	};

	const handlePreview = async (file: any) => {
		if (!file || !file.url) return;
		// const res = await getFileById(file?.url);
		// fileDownload(res.data, file?.name ?? '');
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'bieumaukhaibao.chinhsuabieumau' })
					: intl.formatMessage({ id: 'bieumaukhaibao.themmoibieumau' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='ten'
					label={intl.formatMessage({ id: 'bieumaukhaibao.tenbieumau' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input
						onChange={(e) => {
							if (!edit) form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
						}}
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.tenbieumau' })}
					/>
				</Form.Item>

				<Form.Item
					name='ma'
					label={intl.formatMessage({ id: 'bieumaukhaibao.mabieumau' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder={intl.formatMessage({ id: 'bieumaukhaibao.mabieumau' })} disabled={edit} />
				</Form.Item>

				<Form.Item name='fileId' label={intl.formatMessage({ id: 'bieumaukhaibao.filedinhkem' })}>
					<UploadFile
						fileName={record?.file ? record?.file?.[0]?.name : ''}
						handlePreview={handlePreview}
						maxCount={1}
						otherProps={{
							accept: '.docx, .doc',
							showUploadList: { showDownloadIcon: false },
						}}
					/>
				</Form.Item>

				<TableCauHinh form={form} />

				<Form.Item
					extra={<div>{intl.formatMessage({ id: 'bieumaukhaibao.detrongdeothienthitattacatrong' })}</div>}
					style={{ marginTop: 8 }}
					name='danhSachCotHienThi'
					label={intl.formatMessage({ id: 'bieumaukhaibao.danhsachcothienhi' })}
					// rules={[...rules.required]}
				>
					<Select
						allowClear
						options={record?.cauHinhLoaiHinh?.map((item) => ({ label: item.ten, value: item.ma })) ?? []}
						mode='multiple'
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.danhsachtruongthingtinhienhi' })}
					/>
				</Form.Item>
				<div className='form-footer' style={{ marginTop: 16 }}>
					<Button loading={loading} htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'bieumaukhaibao.them' })
							: intl.formatMessage({ id: 'bieumaukhaibao.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'bieumaukhaibao.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThemMoiMauDon;
