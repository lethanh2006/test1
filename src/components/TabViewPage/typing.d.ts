import type { CSSProperties, JSX } from 'react';

/**
 * Định nghĩa từng tab trong TabViewPage
 */
export type TabViewPageProps = {
	/** Tiêu đề của tab menu */
	title: string;

	/** Menu key, cũng dùng để cho vào hash */
	menuKey: string;

	/** Nội dung của tab */
	content: JSX.Element;

	/** Icon của tab */
	icon?: JSX.Element;

	/** Mã quyền để kiểm tra truy cập */
	accessCode?: string;

	/** Ẩn tab view */
	hide?: boolean;
};

/**
 * Props tổng cho component TabViewPage
 */
export type TabViewPageComponentProps = {
	menu: TabViewPageProps[];

	/** Tiêu đề thẻ Card */
	cardTitle?: string;

	/** Ẩn card bọc ngoài */
	hideCard?: boolean;

	/** Sự kiện chuyển tab */
	onChange?: (key: string) => void;

	/** Nội dung bên dưới Tabs/Steps */
	children?: React.ReactNode;

	/** Kiểu điều hướng: tab hoặc step */
	type?: 'tab' | 'step';

	/** Kiểu tab của antd: card / editable-card / line */
	tabType?: 'editable-card' | 'card' | 'line';

	/** Style riêng cho Tabs */
	tabStyle?: CSSProperties;

	/** Style bọc toàn bộ */
	style?: CSSProperties;

	offsetTop?: number;

	cardBigTitle?: boolean;
};
