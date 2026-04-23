export enum PhuongThucPhanCong {
	NGUOI_TAO_DON = 'Người tạo đơn',
	NGUOI_CU_THE = 'Nhóm người dùng',
	CO_VAN_HOC_TAP = 'Cố vấn học tập',
	DON_VI_CU_THE = 'Đơn vị cụ thể',
	DON_VI_QUAN_LY = 'Đơn vị quản lý',
	HOI_DONG = 'Hội đồng',
	QUYET_DINH = 'Quyết định',
	BIEN_HE_THONG = 'Biến hệ thống',
}

export enum ECapChucVu {
	TRUONG = 'Trưởng',
	PHO = 'Phó',
	CAN_BO = 'Cán bộ, giảng viên',
	NHAN_VIEN = 'Nhân viên',
}

export enum EHocHam {
	GS = 'Giáo sư',
	PGS = 'Phó Giáo sư',
}

export enum EHocVi {
	CN = 'Cử nhân',
	KS = 'Kỹ sư',
	THS = 'Thạc sỹ',
	TS = 'Tiến sỹ',
	GVC = 'Giảng viên chính',
}

export enum ELoaiTinhTrangDon {
	TAT_CA = 'Tất cả',
	CAN_XU_LY = 'Cần xử lý',
	CHUA_CO = 'Chưa có kết quả tiếp nhận',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
	CHUA_TRA_KET_QUA = 'Chưa trả kết quả',
	DA_TRA_KET_QUA = 'Đã trả kết quả',
	YEU_CAU_CHINH_SUA = 'Chỉnh sửa lại',
	DA_CHINH_SUA_LAI = 'Đã chỉnh sửa lại',
}

export const MapKeyNameLoaiTinhTrangDon = {
	[ELoaiTinhTrangDon.TAT_CA]: 'Tất cả đơn',
	[ELoaiTinhTrangDon.CAN_XU_LY]: 'Cần xử lý',
	[ELoaiTinhTrangDon.CHUA_CO]: 'Chờ duyệt',
	[ELoaiTinhTrangDon.YEU_CAU_CHINH_SUA]: 'Cần chỉnh sửa lại',
	[ELoaiTinhTrangDon.DA_CHINH_SUA_LAI]: 'Đã chỉnh sửa lại',
	[ELoaiTinhTrangDon.DUYET]: 'Duyệt',
	[ELoaiTinhTrangDon.KHONG_DUYET]: 'Không duyệt',
	[ELoaiTinhTrangDon.CHUA_TRA_KET_QUA]: 'Chưa trả kết quả',
	[ELoaiTinhTrangDon.DA_TRA_KET_QUA]: 'Đã trả kết quả',
};

export enum DeadlineType {
	DEADLINE_N_NGAY = 'SAU_N_NGAY',
	DEADLINE_THU_TRONG_TUAN = 'CAC_THU_TRONG_TUAN',
}
