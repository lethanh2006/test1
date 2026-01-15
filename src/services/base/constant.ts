import type { ColorType, Login } from './typing';

export enum EModuleKey {
	CONNECT = 'cong-hoc-vien',
	CONG_CAN_BO = 'cong-can-bo',
	QLDT = 'quan-ly-dao-tao',
	TCNS = 'to-chuc-nhan-su',
	CTSV = 'cong-tac-sinh-vien',
	VPS = 'van-phong-so',
	TC = 'tai-chinh',
	QLKH = 'quan-ly-khoa-hoc',
	KT = 'khao-thi',
	CSVC = 'co-so-vat-chat',
	VBCC = 'van-bang-chung-chi',
	THU_VIEN = 'thu-vien',
	CORE = 'danh-muc-chung',
	QLND = 'quan-ly-nguoi-dung',
}

export const AppModules: Record<EModuleKey, Login.TModule> = {
	[EModuleKey.CONNECT]: {
		title: `modules.${EModuleKey.CONNECT}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}connect`,
		url: APP_CONFIG_URL_CONNECT,
		icon: EModuleKey.CONNECT + '.svg',
	},
	[EModuleKey.CONG_CAN_BO]: {
		title: `modules.${EModuleKey.CONG_CAN_BO}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}connect`,
		url: APP_CONFIG_URL_CAN_BO,
		icon: EModuleKey.CONG_CAN_BO + '.svg',
	},
	[EModuleKey.QLDT]: {
		title: `modules.${EModuleKey.QLDT}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qldt`,
		url: APP_CONFIG_URL_DAO_TAO,
		icon: EModuleKey.QLDT + '.svg',
	},
	[EModuleKey.TCNS]: {
		title: `modules.${EModuleKey.TCNS}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tcns`,
		url: APP_CONFIG_URL_NHAN_SU,
		icon: EModuleKey.TCNS + '.svg',
	},
	[EModuleKey.CTSV]: {
		title: `modules.${EModuleKey.CTSV}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}ctsv`,
		url: APP_CONFIG_URL_CTSV,
		icon: EModuleKey.CTSV + '.svg',
	},
	[EModuleKey.VPS]: {
		title: `modules.${EModuleKey.VPS}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}vps`,
		url: APP_CONFIG_URL_VPS,
		icon: EModuleKey.VPS + '.svg',
	},
	[EModuleKey.QLKH]: {
		title: `modules.${EModuleKey.QLKH}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qlkh`,
		url: APP_CONFIG_URL_QLKH,
		icon: EModuleKey.QLKH + '.svg',
	},
	[EModuleKey.TC]: {
		title: `modules.${EModuleKey.TC}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tc`,
		url: APP_CONFIG_URL_TAI_CHINH,
		icon: EModuleKey.TC + '.svg',
	},
	[EModuleKey.KT]: {
		title: `modules.${EModuleKey.KT}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}kt`,
		url: APP_CONFIG_URL_KHAO_THI,
		icon: EModuleKey.KT + '.svg',
	},
	[EModuleKey.CSVC]: {
		title: `modules.${EModuleKey.CSVC}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}csvc`,
		url: APP_CONFIG_URL_CSVC,
		icon: EModuleKey.CSVC + '.svg',
	},
	[EModuleKey.VBCC]: {
		title: `modules.${EModuleKey.VBCC}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}vbcc`,
		url: APP_CONFIG_URL_VBCC,
		icon: EModuleKey.VBCC + '.svg',
	},
	[EModuleKey.THU_VIEN]: {
		title: `modules.${EModuleKey.THU_VIEN}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}thu-vien`,
		url: APP_CONFIG_URL_THU_VIEN,
		icon: EModuleKey.THU_VIEN + '.svg',
	},
	[EModuleKey.CORE]: {
		title: `modules.${EModuleKey.CORE}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}core`,
		url: APP_CONFIG_URL_CORE,
		icon: EModuleKey.CORE + '.svg',
	},
	[EModuleKey.QLND]: {
		title: `modules.${EModuleKey.QLND}`,
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qlnd`,
		url: APP_CONFIG_URL_QLND,
		icon: EModuleKey.QLND + '.svg',
	},
};

export const moduleQuanLyVanBan: Partial<Login.TModule> = {
	title: `modules.quan-ly-van-ban`,
	url: APP_CONFIG_URL_QLVB,
	icon: 'quan-ly-van-ban.svg',
};

export const moduleCongThongTin: Partial<Login.TModule> = {
	title: `modules.cong-thong-tin`,
	url: APP_CONFIG_URL_LANDING,
	icon: 'cong-thong-tin.svg',
};

export const moduleTapChiKhoaHoc: Partial<Login.TModule> = {
	title: `modules.tap-chi-khoa-hoc`,
	url: APP_CONFIG_URL_TAP_CHI_KH,
	icon: 'tap-chi-khoa-hoc.svg',
};

/** Đường link landing page */
export const landingUrl = APP_CONFIG_URL_LANDING;

/** Màu sắc chủ đạo */
export const primaryColor = APP_CONFIG_PRIMARY_COLOR;

/** Tên trường Học viện */
export const unitName = 'config.ten-truong';

/** Cơ quan chủ quản của trường */
export const coQuanChuQuan = 'config.co-quan-chu-quan';

/** Trường / Học viện */
export const unitPrefix = 'config.tien-to-truong';

/** Tên tiếng anh của trường */
export const tenTruongVietTatTiengAnh = APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH;

/** Cài đặt hệ thống */
export enum ESettingKey {
	KEY = 'KEY',
}

/** Định dạng file */
export enum EDinhDangFile {
	WORD = 'word',
	EXCEL = 'excel',
	POWERPOINT = 'powerpoint',
	PDF = 'pdf',
	IMAGE = 'image',
	VIDEO = 'video',
	AUDIO = 'audio',
	TEXT = 'text',
	UNKNOWN = 'unknown',
}

export enum EScopeFile {
	PUBLIC = 'Public',
	INTERNAL = 'Internal',
	PRIVATE = 'Private',
}

export enum EStorageFile {
	DATABASE = 'Database',
	S3 = 'S3',
}

/** Tên các màu mặc định của Tag's antd */
export enum ETagColor {
	MAGENTA = 'magenta',
	RED = 'red',
	VOLCANO = 'volcano',
	ORANGE = 'orange',
	GOLD = 'gold',
	YELLOW = 'yellow',
	LIME = 'lime',
	GREEN = 'green',
	CYAN = 'cyan',
	BLUE = 'blue',
	GEEKBLUE = 'geekblue',
	PURPLE = 'purple',
	DEFAULT = 'default',
}

/** Mapping từ màu tag antd sang color code */
export const colorList: { [key in keyof typeof ETagColor]: ColorType } = {
	MAGENTA: { name: 'magenta', hexColor: '#eb2f96' },
	RED: { name: 'red', hexColor: '#f5222d' },
	VOLCANO: { name: 'volcano', hexColor: '#fa541c' },
	ORANGE: { name: 'orange', hexColor: '#fa8c16' },
	GOLD: { name: 'gold', hexColor: '#faad14' },
	YELLOW: { name: 'yellow', hexColor: '#fadb14' },
	LIME: { name: 'lime', hexColor: '#a0d911' },
	GREEN: { name: 'green', hexColor: '#52c41a' },
	CYAN: { name: 'cyan', hexColor: '#13c2c2' },
	BLUE: { name: 'blue', hexColor: '#1890ff' },
	GEEKBLUE: { name: 'geekblue', hexColor: '#2f54eb' },
	PURPLE: { name: 'purple', hexColor: '#722ed1' },
	DEFAULT: { name: 'default', hexColor: '#bfbfbf' },
};
