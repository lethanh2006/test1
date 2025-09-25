import { ELoaiPhanHoi } from '@/services/TienIch/PhanHoi/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormItemUrlOrUpload from '../Upload/FormItemUrlOrUpload';

const FormPostIssue = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { formSubmiting, postModel, setFormSubmiting } = useModel('tienich.phanhoi');
	const [form] = Form.useForm();
	const { visible, setVisible } = props;

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const onFinish = async (values: any) => {
		if (!!values.urlPhanAnh && typeof values.urlPhanAnh !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values, 'urlPhanAnh')
				.then((urlPhanAnh) => (values.urlPhanAnh = urlPhanAnh))
				.catch(() => (values.urlPhanAnh = null))
				.finally(() => setFormSubmiting(false));
		}

		postModel({
			...values,
			loaiPhanHoi: ELoaiPhanHoi.KY_THUAT,
		})
			.then(() => {
				setVisible(false);
			})
			.catch((er) => console.log(er));
	};

	return (
		<>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Form.Item
					rules={[...rules.required, ...rules.length(5000), ...rules.text]}
					name='noiDungPhanHoi'
					label={intl.formatMessage({ id: 'global.technical.form.mota' })}
				>
					<Input.TextArea
						rows={3}
						placeholder={`${intl.formatMessage({ id: 'global.technical.form.mota.placeholder' })}`}
					/>
				</Form.Item>

				<FormItemUrlOrUpload form={form} field='urlPhanAnh' />

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.technical.button.gui' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.technical.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormPostIssue;
