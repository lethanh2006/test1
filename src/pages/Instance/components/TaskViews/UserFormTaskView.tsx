import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import FormRender from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormRender';
import { getDefaultValueOfFormDong } from '@/services/DanhMuc/BieuMau/api';
import { EKieuDuLieu } from '@/services/DanhMuc/BieuMau/constant';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { ETrangThaiInstanceTask } from '@/services/Instance/constance';
import { saveDraftInstanceTask } from '@/services/Instance/task';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { ELoaiDanhMucChung } from '@/services/Workflow/DanhMucChung/constant';
import { useModel, useParams } from '@umijs/max';
import { Button, Form, Input, InputNumber, message, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import ResultFormDetail from './ResultFormDetail';
import { TaskRendererProps } from './types';

const { Paragraph } = Typography;

export const UserFormTaskView: React.FC<TaskRendererProps> = ({
	task,
	onSubmit,
	loading,
	onCheckAllowReoperate,
	allowReoperate,
}) => {
	const intl = useIntl();
	const { id } = useParams<{ id: string }>();
	const [form] = Form.useForm();
	const { getByIdModel, recordQuyTrinhForm, setRecordQuyTrinhForm } = useModel('danhmuc.bieumau');
	const { getAllModel: getAllDanhMucChung } = useModel('workflow.danhmuc.index');
	const { getInstaceContextValue } = useModel('workflow.instance');
	const { setLoading } = useModel('workflow.instancetask');
	const [externalFormConfig, setExternalFormConfig] = useState<BieuMau.IRecord>();
	const lastNodeIdRef = useRef<string | undefined>(task.nodeId);

	const fields = React.useMemo(
		() =>
			(task.config?.fields as Array<{
				name: string;
				label: string;
				defaultValue?: string;
				type: 'text' | 'number' | 'date' | 'email' | 'file';
				readOnly?: boolean;
				required: boolean;
				placeholder?: string;
			}>) || [],
		[task.nodeId],
	);

	const externalFormId = task.config?.externalFormId;

	useEffect(() => {
		getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
	}, []);

	useEffect(() => {
		if (externalFormId) {
			getByIdModel(externalFormId).then((res: any) => {
				setExternalFormConfig(res);
			});

			// Fetch FormDong layout defaults
			getDefaultValueOfFormDong(externalFormId)
				.then((res: any) => {
					if (res?.data?.data && !task?.ketQua) {
						form.setFieldsValue(res.data.data);
					}
				})
				.catch((err) => console.error('Could not fetch form default values', err));
		}
	}, [externalFormId, task?.ketQua]);

	useEffect(() => {
		// Cùng node: chỉ cập nhật nếu ketQua thay đổi, không reset lại (tránh đè default values)
		if (lastNodeIdRef.current === task.nodeId) {
			if (task.ketQua) {
				const values = { ...task.ketQua };
				if (externalFormId && externalFormConfig) {
					externalFormConfig.cauHinhLoaiHinh?.forEach((field) => {
						if (
							[EKieuDuLieu.DATE, EKieuDuLieu.HOUR, EKieuDuLieu.MONTH].includes(field.kieuDuLieu) &&
							values[field.ma]
						) {
							values[field.ma] = dayjs(values[field.ma]);
						}
					});
				} else {
					fields.forEach((field) => {
						if (field.type === 'date' && values[field.name]) {
							values[field.name] = dayjs(values[field.name]);
						}
					});
				}
				setRecordQuyTrinhForm({
					...(recordQuyTrinhForm || {}),
					thongTinKhaiBao: {
						...(recordQuyTrinhForm?.thongTinKhaiBao ?? {}),
						...values,
					},
				});
				form.setFieldsValue(values);
			}
			return;
		}

		if (loading) return;

		if (task.ketQua) {
			const values = { ...task.ketQua };
			if (externalFormId && externalFormConfig) {
				externalFormConfig.cauHinhLoaiHinh?.forEach((field) => {
					if ([EKieuDuLieu.DATE, EKieuDuLieu.HOUR, EKieuDuLieu.MONTH].includes(field.kieuDuLieu) && values[field.ma]) {
						values[field.ma] = dayjs(values[field.ma]);
					}
				});

				externalFormConfig.cauHinhLoaiHinh?.forEach((field) => {
					if (field.kieuDuLieu === EKieuDuLieu.TABLE && values[field.ma] !== undefined) {
						const raw = values[field.ma];
						let normalized: any = raw;
						if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
							const keys = Object.keys(raw);
							if (keys.every((k) => /^\d+$/.test(k))) {
								normalized = keys.sort((a, b) => Number(a) - Number(b)).map((k) => raw[k]);
							}
						}
						values[`table||${field.ma}`] = normalized;
						values[field.ma] = normalized;
					}
				});
			} else {
				fields.forEach((field) => {
					if (field.type === 'date' && values[field.name]) {
						values[field.name] = dayjs(values[field.name]);
					}
				});
			}
			form.setFieldsValue(values);
		} else {
			form.resetFields();
		}

		lastNodeIdRef.current = task.nodeId;
	}, [task.ketQua, form, fields, externalFormConfig, loading, task.nodeId]);

	// useEffect(() => {
	// 	if (!id || !fields.length) return;

	// 	fields.forEach((field) => {
	// 		if (field.defaultValue) {
	// 			getInstaceContextValue(id, { rawValue: field.defaultValue }).then((dt) => {
	// 				form.setFieldValue(field.name, dt);
	// 			});
	// 		}
	// 	});
	// }, [task.nodeId, id, fields, form]);

	useEffect(() => {
		if (!id || !fields.length) return;

		let isCanceled = false;

		const fetchDefaultValues = async () => {
			const normalizeValue = (value: any) => {
				if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
				const keys = Object.keys(value);
				if (keys.every((key) => /^\d+$/.test(key))) {
					return keys.sort((a, b) => Number(a) - Number(b)).map((key) => value[key]);
				}
				return value;
			};

			const promises = fields
				.filter((f) => f.defaultValue)
				.map(async (field) => {
					const dt = await getInstaceContextValue(id, { rawValue: field.defaultValue! });
					return { name: field.name, value: dt };
				});

			const results = await Promise.all(promises);

			if (isCanceled) return;

			const valuesToUpdate = results.reduce(
				(acc, curr) => {
					acc[curr.name] = normalizeValue(curr.value);
					return acc;
				},
				{} as Record<string, any>,
			);

			form.setFieldsValue(valuesToUpdate);
			setRecordQuyTrinhForm((prev: any) => ({
				...(prev || {}),
				thongTinKhaiBao: {
					...(prev?.thongTinKhaiBao || {}),
					...valuesToUpdate,
				},
			}));
		};

		fetchDefaultValues();

		return () => {
			isCanceled = true;
		};
	}, [task.nodeId, id, fields, form, setRecordQuyTrinhForm]);

	const handleSubmit = async (values: Record<string, any>) => {
		setLoading(true);
		try {
			for (const item in values) {
				const value = values[item];
				if (value?.fileList?.length) {
					values[item] = await buildUpLoadMultiFile(values, item);
				}
			}
		} catch (err) {
			setLoading(false);
			message.error(intl.formatMessage({ id: 'workflow.instance.userForm.error.uploadFailed' }));
			return;
		}
		const payload = {
			outcome: {
				...recordQuyTrinhForm?.thongTinKhaiBao,
				...values,
			},
		};
		await onSubmit(payload);
	};

	const saveDraft = React.useCallback(
		_.debounce(async (values: Record<string, any>, currentTableData: any) => {
			if (!id || task.trangThai === ETrangThaiInstanceTask.DA_XU_LY || !task.nodeId) return;
			try {
				const mergedOutcome = {
					...currentTableData,
					...values,
				};
				await saveDraftInstanceTask(task._id, { outcome: mergedOutcome });
			} catch (error) {
				console.error('Failed to save draft', error);
			}
		}, 1000),
		[id, task.nodeId, task.trangThai],
	);

	const handleValuesChange = (_changedValues: any, allValues: any) => {
		if (!isNotAllowAction) {
			saveDraft(allValues, recordQuyTrinhForm?.thongTinKhaiBao);
		}
	};

	// Nếu allowReoperate === true, cho phép action (form enabled)
	// Ngược lại, disable nếu task đã xử lý HOẶC không có quyền
	const isNotAllowAction = allowReoperate
		? false
		: task.trangThai === ETrangThaiInstanceTask.DA_XU_LY || !task.isActOnSelf;

	const renderField = (field: (typeof fields)[0]) => {
		switch (field.type) {
			case 'date':
				return <MyDatePicker readOnly={field.readOnly} disabled={isNotAllowAction} placeholder={field.placeholder} />;
			case 'number':
				return <InputNumber readOnly={field.readOnly} disabled={isNotAllowAction} placeholder={field.placeholder} />;
			case 'email':
				return (
					<Input disabled={isNotAllowAction} readOnly={field.readOnly} type='email' placeholder={field.placeholder} />
				);
			case 'file':
				return <UploadFile disabled={true} />;
			case 'text':
			default:
				return <Input readOnly={field.readOnly} disabled={isNotAllowAction} placeholder={field.placeholder} />;
		}
	};

	if (!fields.length && !externalFormId) {
		return (
			<Paragraph type='secondary'>{intl.formatMessage({ id: 'workflow.instance.userForm.emptyFields' })}</Paragraph>
		);
	}

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit} onValuesChange={handleValuesChange}>
			{isNotAllowAction ? (
				<>
					<ResultFormDetail data={task} />
				</>
			) : (
				<>
					{externalFormId && externalFormConfig ? (
						<Row gutter={[12, 12]}>
							{externalFormConfig?.cauHinhLoaiHinh?.map((item) => (
								<FormRender
									key={item.ma}
									cauHinh={{ ...item, readonly: isNotAllowAction || item.readonly }}
									form={form}
								/>
							))}
						</Row>
					) : (
						fields.map((field) => (
							<Form.Item
								key={field.name}
								name={field.name}
								label={field.label}
								rules={[
									{
										required: field.required,
										message: intl.formatMessage(
											{ id: 'workflow.instance.userForm.requiredField' },
											{ label: field.label },
										),
									},
								]}
							>
								{renderField(field)}
							</Form.Item>
						))
					)}
				</>
			)}
			<div className='form-footer'>
				<Button
					hidden={
						isNotAllowAction ||
						(task.trangThai === ETrangThaiInstanceTask.DA_XU_LY &&
							!(task.config?.editable === true && allowReoperate === true))
					}
					type='primary'
					size='small'
					htmlType='submit'
					loading={loading}
				>
					{intl.formatMessage({ id: 'workflow.instance.userForm.submit' })}
				</Button>
				{isNotAllowAction && task.isActOnSelf && (
					<Button
						hidden={task.trangThai !== ETrangThaiInstanceTask.DA_XU_LY || task.config?.editable !== true}
						disabled={task.trangThai === ETrangThaiInstanceTask.DA_XU_LY}
						type='primary'
						size='small'
						onClick={onCheckAllowReoperate}
						loading={loading}
					>
						{intl.formatMessage({ id: 'workflow.instance.userForm.edit' })}
					</Button>
				)}
			</div>
		</Form>
	);
};
