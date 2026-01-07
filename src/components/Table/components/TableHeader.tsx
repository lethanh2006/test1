import ButtonExtend from '@/components/Table/ButtonExtend';
import { primaryColor } from '@/services/base/constant';
import { inputFormat } from '@/utils/utils';
import {
	ExportOutlined,
	FilterOutlined,
	FilterTwoTone,
	ImportOutlined,
	PlusCircleOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useIntl } from 'umi';
import { findFiltersInColumns } from '../utils';
import { useTableContext } from './TableContext';

export const TableHeader: React.FC = () => {
	const intl = useIntl();
	const {
		buttons,
		otherButtons,
		rowSelection,
		deleteMany,
		selectedIds,
		handleDeleteMany,
		hasFilter,
		finalColumns,
		filters,
		setVisibleFilter,
		setVisibleImport,
		setVisibleExport,
		onCreate,
		onReload,
		loading,
		total,
		hideTotal,
		size,
	} = useTableContext();

	return (
		<div className='header'>
			<div className='action'>
				{buttons?.create !== false ? (
					<ButtonExtend
						size={size}
						onClick={onCreate}
						icon={<PlusCircleOutlined />}
						className='btn-add'
						type='primary'
						notHideText
						tooltip={intl.formatMessage({ id: 'global.table.index.button.themmoi.tooltip' })}
					>
						{intl.formatMessage({ id: 'global.table.index.button.themmoi' })}
					</ButtonExtend>
				) : null}

				{buttons?.import ? (
					<ButtonExtend
						size={size}
						icon={<ImportOutlined />}
						onClick={() => setVisibleImport(true)}
						className='btn-import'
					>
						{intl.formatMessage({ id: 'global.table.index.button.nhapdulieu' })}
					</ButtonExtend>
				) : null}
				{buttons?.export ? (
					<ButtonExtend
						size={size}
						icon={<ExportOutlined />}
						onClick={() => setVisibleExport(true)}
						className='btn-export'
					>
						{intl.formatMessage({ id: 'global.table.index.button.xuatdulieu' })}{' '}
						{selectedIds?.length && selectedIds?.length > 0 ? `(${selectedIds?.length})` : ''}
					</ButtonExtend>
				) : null}

				{otherButtons}

				{rowSelection && deleteMany && selectedIds?.length ? (
					<Popconfirm
						title={intl.formatMessage({ id: 'global.table.index.button.xoa.title' }, { count: selectedIds?.length })}
						onConfirm={handleDeleteMany}
					>
						<ButtonExtend type='link' danger>
							{intl.formatMessage({ id: 'global.table.index.button.xoa' }, { count: selectedIds?.length })}
						</ButtonExtend>
					</Popconfirm>
				) : null}
			</div>

			<div className='extra'>
				{buttons?.reload !== false ? (
					<ButtonExtend
						size={size}
						icon={<ReloadOutlined />}
						onClick={onReload}
						loading={loading}
						className='btn-reload'
						tooltip={intl.formatMessage({ id: 'global.table.index.button.tailai.tooltip' })}
					>
						{intl.formatMessage({ id: 'global.table.index.button.tailai' })}
					</ButtonExtend>
				) : null}

				{buttons?.filter !== false && hasFilter ? (
					<ButtonExtend
						className='btn-filter'
						size={size}
						icon={
							findFiltersInColumns(finalColumns, filters)?.length ? (
								<FilterTwoTone twoToneColor={primaryColor} />
							) : (
								<FilterOutlined />
							)
						}
						onClick={() => setVisibleFilter(true)}
						tooltip={intl.formatMessage({ id: 'global.table.index.button.boloc.tooltip' })}
						style={
							findFiltersInColumns(finalColumns, filters)?.length
								? {
										borderColor: primaryColor,
										borderWidth: '1px',
										borderStyle: 'solid',
									}
								: undefined
						}
					>
						{intl.formatMessage({ id: 'global.table.index.button.boloc' })}
					</ButtonExtend>
				) : null}

				{!hideTotal ? (
					<Tooltip title={intl.formatMessage({ id: 'global.table.index.button.tongso.tooltip' })}>
						<div className={classNames({ total: true, small: size === 'small' })}>
							{intl.formatMessage({ id: 'global.table.index.button.tongso' })}:<span>{inputFormat(total || 0)}</span>
						</div>
					</Tooltip>
				) : null}
			</div>
		</div>
	);
};
