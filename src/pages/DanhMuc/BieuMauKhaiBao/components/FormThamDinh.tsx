import { ELoaiPhepToan } from '@/services/DanhMuc/BieuMau/constant';
import rules from '@/utils/rules';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';

const FormThamDinh = () => {
	const intl = useIntl();
	return (
		<div style={{ marginTop: 12 }}>
			<div className='ant-descriptions-title' style={{ marginBottom: 12 }}>
				{intl.formatMessage({ id: 'bieumaukhaibao.thamdinhdulieuneuco' })}
			</div>
			<Form.List name='thamDinh'>
				{(fields, { add, remove }) => (
					<>
						{fields.map(({ key, name, ...restField }) => (
							<Card
								size='small'
								key={key}
								style={{ marginBottom: 16 }}
								title={
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<span>
											{intl.formatMessage({ id: 'bieumaukhaibao.luatthamdinh' })} {name + 1}
										</span>
										<Button type='text' danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
									</div>
								}
							>
								<Row gutter={[12, 0]}>
									<Col span={24}>
										<Form.Item
											{...restField}
											name={[name, 'loaiPhepToan']}
											label={intl.formatMessage({ id: 'bieumaukhaibao.loaipheptoan' })}
											rules={[...rules.required]}
										>
											<Select
												options={Object.values(ELoaiPhepToan).map((item) => ({ value: item, label: item }))}
												placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chonloaipheptoan' })}
											/>
										</Form.Item>
									</Col>
								</Row>

								<Form.Item
									noStyle
									shouldUpdate={(prevValues, currentValues) =>
										prevValues.thamDinh?.[name]?.loaiPhepToan !== currentValues.thamDinh?.[name]?.loaiPhepToan
									}
								>
									{({ getFieldValue }) => {
										const loaiPhepToan = getFieldValue(['thamDinh', name, 'loaiPhepToan']);

										if (loaiPhepToan === ELoaiPhepToan.BIEU_THUC_TUY_CHINH) {
											return (
												<>
													<Form.Item
														{...restField}
														name={[name, 'value', 'dieuKienKichHoat']}
														label={intl.formatMessage({ id: 'bieumaukhaibao.dieukienkichhoat' })}
														extra={intl.formatMessage({ id: 'bieumaukhaibao.detrong' })}
													>
														<Input.TextArea
															rows={2}
															placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapdieukienkichhoat' })}
														/>
													</Form.Item>

													<Form.Item
														{...restField}
														name={[name, 'value', 'bieuThuc']}
														label={intl.formatMessage({ id: 'bieumaukhaibao.bieuthucthamdinh' })}
														rules={[...rules.required]}
													>
														<Input.TextArea
															rows={3}
															placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapbieuthu' })}
														/>
													</Form.Item>

													<Form.Item
														{...restField}
														name={[name, 'value', 'thongBaoLoi']}
														label={intl.formatMessage({ id: 'bieumaukhaibao.thongbaoloi' })}
														rules={[...rules.required]}
													>
														<Input placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapthongbaoloi' })} />
													</Form.Item>
												</>
											);
										}
										return null;
									}}
								</Form.Item>
							</Card>
						))}
						<Form.Item>
							<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
								{intl.formatMessage({ id: 'bieumaukhaibao.themluatthamdinh' })}
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
		</div>
	);
};

export default FormThamDinh;
