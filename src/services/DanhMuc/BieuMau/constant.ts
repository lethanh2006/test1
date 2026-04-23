export enum EKieuDuLieu {
  DOAN_VAN_BAN = 'Đoạn văn bản',
  NUMBER = 'Số nguyên',
  DECIMAL = 'Số thập phân',
  TEXT = 'Chữ',
  BOOLEAN = 'Boolean',
  HOUR = 'Ngày/tháng/năm + giờ',
  DATE = 'Ngày/tháng/năm',
  MONTH = 'Tháng/năm',
  DANHMUC = 'Danh mục',
  TABLE = 'Bảng',
  FILE = 'File',
  CAN_BO = 'TCNS - Cán bộ',
  SINH_VIEN = 'QLĐT - Sinh viên',
  DANHSACH = 'Danh sách sản phẩm NCKH',
}

export enum ETextDisplay {
  TEXT_AREA = 'TEXT_AREA',
  TEXT_EDITOR = 'TEXT_EDITOR',
}

export const MapKeyNameTextDisplay = {
  [ETextDisplay.TEXT_AREA]: 'Text Area',
  [ETextDisplay.TEXT_EDITOR]: 'Text Editor',
};

export enum LoaiDefaultValue {
  QLDT_SV_HO_TEN = 'QLDT - Họ tên sinh viên',
  QLDT_SV_HO_DEM = 'QLDT - Họ đệm sinh viên',
  QLDT_SV_TEN = 'QLDT - Tên sinh viên',
  QLDT_SV_MA_SINH_VIEN = 'QLDT - Mã sinh viên',
  QLDT_SV_NGAY_SINH = 'QLDT - Ngày sinh sinh viên',
  QLDT_SV_LOP_HC = 'QLDT - Lớp hành chính sinh viên',
  QLDT_SV_KHOA = 'QLDT - Khóa sinh viên',
  QLDT_SV_NGANH = 'QLDT - Ngành sinh viên',
  QLDT_SV_CHUYEN_NGANH = 'QLDT - Chuyên ngành sinh viên',
  QLDT_SV_DON_VI = 'QLDT - Đơn vị sinh viên',
  QLDT_SV_TRINH_DO = 'QLDT - Trình độ đào tạo sinh viên',
  QLDT_SV_HINH_THUC = 'QLDT - Hình thức đào tạo sinh viên',
  QLDT_SV_SO_DT = 'QLDT - Số điện thoại sinh viên',
  QLDT_SV_GIOI_TINH = 'QLDT - Giới tính sinh viên',
  QLDT_SV_HKTT = 'QLDT - Hộ khẩu thường trú',
  QLDT_SV_TINH_HKTT = 'QLDT - Tỉnh thành hộ khẩu thường trú',
  QLDT_SV_QH_HKTT = 'QLDT - Quận huyện hộ khẩu thường trú',
  QLDT_SV_XP_HKTT = 'QLDT - Xã phường hộ khẩu thường trú',
  QLDT_SV_CMTCCCD = 'QLDT - Căn cước công dân',
  QLDT_SV_NGAY_CAP_CMTCCCD = 'QLDT - Ngày cấp căn cước công dân',
  QLDT_SV_NOI_CAP_CMTCCCD = 'QLDT - Nơi cấp căn cước công dân',
  TCNS_HO_TEN = 'TCNS - Họ tên',
  TCNS_HO_DEM = 'TCNS - Họ đệm',
  TCNS_TEN = 'TCNS - Tên',
  TCNS_GIOI_TINH = 'TCNS - Giới tính',
  TCNS_MA_CAN_BO = 'TCNS - Mã cán bộ',
  TCNS_NGAY_SINH = 'TCNS - Ngày sinh',
  TNCS_DON_VI = 'TCNS - Đơn vị chính',
  TCNS_SO_DIEN_THOAI = 'TCNS - Số điện thoại',
  TCNS_HOC_HAM = 'TCNS - Học hàm',
  TCNS_HOC_VI = 'TCNS - Học vị',
  TCNS_TRINH_DO_DAO_TAO = 'TCNS - Trình độ đào tạo',
  TCNS_CCCD = 'TCNS - Căn cước công dân',
  TCNS_CHUC_VU = 'TCNS - Chức vụ',
  THONG_KE_DON_QUY_TRINH = 'Thống kê - Đơn quy trình',
  MAP_DANH_MUC = 'Map danh mục',
  LAY_TU_KHAI_BAO = 'Lấy từ khai báo',
  CUSTOM = 'Tùy biến',
}

export enum ELoaiLoaiHinh {
  SP = 'Sản phẩm',
  HD = 'Hoạt động',
  KHAC = 'Khác',
}

export enum ELoaiThoiGianThucHien {
  NGAYTHANGNAM = 'Mốc thời gian bắt đầu - kết thúc (ngày/tháng/năm)',
  THANGNAM = 'Mốc thời gian bắt đầu - kết thúc (tháng/năm)',
  NAM = 'Mốc thời gian bắt đầu - kết thúc (năm)',
  THOIGIANCUTHE_DDMMYYYY = 'Thời gian cụ thể (ngày/tháng/năm)',
  THOIGIANCUTHE_MMYYYY = 'Thời gian cụ thể (tháng/năm)',
  THOIGIANCUTHE_YYYY = 'Thời gian cụ thể (năm)',
}

export enum ELoaiQuyDoiGio {
  CHIA_DEU = 'Sử dụng giờ tổng để chia cho các thành viên',
  DON_VI_VA_HE_SO = 'Quy đổi theo đơn vị và hệ số',
  KHONG_CHIA_DEU = 'Quy đổi cho từng thành viên',
  TUY_BIEN = 'Công thức tùy biến',
}

export enum ELoaiTinhGioThanhVien {
  PHAN_TRAM = 'Phần trăm',
  GIO_CO_DINH = 'Giờ cố định',
}

export enum ELoaiPhepToan {
  BANG = 'Bằng',
  KHONG_BANG = 'Không bằng',
  LON_HON = 'Lớn hơn',
  NHO_HON = 'Nhỏ hơn',
  LON_HON_BANG = 'Lớn hơn hoặc bằng',
  NHO_HON_BANG = 'Nhỏ hơn hoặc bằng',
  KHONG_CO_GIA_TRI = 'Không có giá trị',
  CO_GIA_TRI = 'Có giá trị',
  NAM_TRONG = 'Nằm trong',
  KHONG_NAM_TRONG = 'Không nằm trong',
  BIEU_THUC_TUY_CHINH = 'Biểu thức tùy chỉnh',
  CUSTOM_SCRIPT = 'Biểu thức tùy chỉnh',
}

export enum ELoaiTruongThongTinTinh {
  VAI_TRO = 'Vai trò',
  THOI_GIAN_BAT_DAU = 'Thời gian bắt đầu',
  THOI_GIAN_KET_THUC = 'Thời gian kết thúc',
  MOC_THOI_GIAN = 'Mốc thời gian',
  DANH_SACH_THANH_VIEN = 'Danh sách thành viên',
  SAN_PHAM_NCKH_LIEN_QUAN = 'Sản phẩm NCKH liên quan',
}