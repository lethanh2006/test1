import ModalExpandable from '@/components/Table/ModalExpandable';
import React from 'react';
import { useIntl } from 'umi';
import { useTableContext } from './TableContext';
import { TableFormDrawer } from './TableFormDrawer';

export const TableFormModal: React.FC = () => {
	const intl = useIntl();
	const {
		Form,
		visibleForm,
		setVisibleForm,
		title,
		widthDrawer,
		maskCloseableForm,
		destroyModal,
		formType,
		modalTitle,
		showModalTitle,
		isView,
		edit,
		formProps,
	} = useTableContext();

	if (!Form) return null;

	if (formType === 'Drawer') {
		return <TableFormDrawer />;
	}

	const getTitle = () => {
		if (modalTitle) return modalTitle;
		if (!showModalTitle || !title) return undefined;
		const id = isView
			? 'global.table.form.title.chitiet'
			: edit
				? 'global.table.form.title.chinhsua'
				: 'global.table.form.title.themmoi';
		return intl.formatMessage({ id }, { title: title?.toString().toLocaleLowerCase() });
	};

	return (
		<ModalExpandable
			title={getTitle()}
			fullScreen={widthDrawer === 'full'}
			maskClosable={maskCloseableForm || false}
			width={widthDrawer !== 'full' ? (widthDrawer ?? 600) : undefined}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			styles={!modalTitle && (!showModalTitle || !title) ? { body: { padding: 0 } } : undefined}
			open={visibleForm}
			destroyOnClose={destroyModal || false}
		>
			<Form title={title ?? ''} {...formProps} />
		</ModalExpandable>
	);
};
