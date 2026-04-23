import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';

import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { Button, Card, Col, Form, message, Row } from 'antd';
import { useIntl, useModel } from 'umi';

const FormSubmitTask = (props: {
	canActOnSelf: Instance.IInstanceTask;
	handleRefreshAfterAction: () => Promise<void>;
	outcome: any;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { completeTask, setLoading, loading, setVisibleForm } = useModel('workflow.instancetask');
	const { canActOnSelf, handleRefreshAfterAction, outcome } = props;
	const onFinish = async (values: any) => {
		try {
			setLoading(true);

			const vanBanKemTheo = await buildUpLoadMultiFile(values, 'vanBanKemTheo', undefined, false);
			const payload = {
				outcome: {
					...values,
					vanBanKemTheo,
					...outcome,
				},
			};

			try {
				await completeTask(canActOnSelf._id, payload);
				message.success(intl.formatMessage({ id: 'workflow.instance.formSubmit.success.completed' }));
				setVisibleForm(false);
				await handleRefreshAfterAction();
			} catch (error: any) {
				message.error(error?.message || intl.formatMessage({ id: 'workflow.instance.task.error.complete' }));
			}
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={intl.formatMessage({ id: 'workflow.instance.formSubmit.title' })} className='form-card'>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[16, 0]}>
					<Col xs={24}>
						<Form.Item
							name='ghiChu'
							label={intl.formatMessage({ id: 'workflow.instance.detail.field.note' })}
							// rules={[...rules.requiredHtml]}
						>
							<TinyEditor height={300} />
						</Form.Item>
					</Col>

					{/* <Col xs={24} lg={12}>
                        <Form.Item name='namThucHien' label='Năm thực hiện' rules={[...rules.required]}>
                            <InputNumber
                                addonBefore='Năm'
                                style={{ width: '100%' }}
                                min={2010}
                                max={2100}
                                placeholder='Năm thực hiện'
                            />
                        </Form.Item>
                    </Col> */}
					{/* {Object.values(EMocThoiGianDot).map((item) => (
                        <Col key={item} xs={24} lg={12}>
                            <Form.Item name={item} label={MapKeyNameMocThoiGianDot[item]} rules={[...rules.required]}>
                                <MyDateRangePicker format={'DD/MM/YYYY'} placeholder={['Từ ngày', 'đến ngày']} />
                            </Form.Item>
                        </Col>
                    ))} */}

					<Col xs={24} sm={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'workflow.instance.formSubmit.attachmentOptional' })}
							name='vanBanKemTheo'
						>
							<UploadFile
								maxCount={5}
								accept='.doc, .docx, .pdf'
								otherProps={{
									multiple: true,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>

					{/* {Object.values(EVanBanDot).map((item: any) => (
                        <Col key={item} xs={24} sm={8}>
                            <Form.Item label={MapKeyNameVanBanDot[item]} name={item}>
                                <UploadFile
                                    maxCount={1}
                                    accept='.doc, .docx, .pdf'
                                    otherProps={{
                                        multiple: false,
                                        showUploadList: { showDownloadIcon: false },
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    ))} */}
				</Row>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'workflow.instance.formSubmit.save' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'workflow.common.cancel' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormSubmitTask;
