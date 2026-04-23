import { EHocHam, EHocVi } from "@/services/ThamQuyen/constant";

declare module ThongTinNhanSu {

  export interface IRecord {
    _id: string;
    ssoId: string;
    hoDem?: string;
    ten: string;
    ngaySinh?: string;
    maCanBo?: string;
    tenGoiKhac?: string | null;
    biDanh?: string | null;
    trangThai?: string;
    preTrangThai?: string | null;
    gioiTinh?: string;
    email?: string;

    // Thông tin Nơi sinh
    noiSinhThanhPhoMa?: string | null;
    noiSinhThanhPhoTen?: string | null;
    noiSinhQuanMa?: string | null;
    noiSinhQuanTen?: string | null;
    noiSinhXaMa?: string | null;
    noiSinhXaTen?: string | null;

    // Thông tin Quê quán
    queQuanThanhPhoMa?: string | null;
    queQuanThanhPhoTen?: string | null;
    queQuanQuanMa?: string | null;
    queQuanQuanTen?: string | null;
    queQuanXaMa?: string | null;
    queQuanXaTen?: string | null;

    // Thông tin Hộ khẩu thường trú
    hoKhauSoNha?: string | null;
    hoKhauThanhPhoMa?: string | null;
    hoKhauThanhPhoTen?: string | null;
    hoKhauQuanMa?: string | null;
    hoKhauQuanTen?: string | null;
    hoKhauXaMa?: string | null;
    hoKhauXaTen?: string | null;

    // Thông tin Nơi ở hiện nay
    noiOSoNha?: string | null;
    noiOThanhPhoMa?: string | null;
    noiOThanhPhoTen?: string | null;
    noiOQuanMa?: string | null;
    noiOQuanTen?: string | null;
    noiOXaMa?: string | null;
    noiOXaTen?: string | null;

    // Liên lạc và Định danh
    sdtCaNhan?: string;
    sdtNhaRieng?: string | null;
    sdtCoQuan?: string | null;
    ghiChu?: string | null;
    fullName?: string | null;
    quocTichId?: string;
    danTocId?: string;
    tonGiaoId?: string;
    ngayVaoNganhYTe?: string | null;
    cccdCMND?: string;
    ngayCap?: string;
    noiCap?: string;
    tinhTrangHonNhanId?: string;

    // Tài chính và Bảo hiểm
    tenNganHang?: string;
    chiNhanh?: string;
    soTaiKhoan?: string;
    soSoBHXH?: string;
    noiCapBHXH?: string | null;
    ngayCapBHXH?: string | null;
    ngayThamGiaBHXH?: string | null;
    ghiChuBHXH?: string | null;
    maSoThue?: string;
    ngayCapMaSoThue?: string | null;

    // Đặc điểm cá nhân
    listFileUrl?: string | null;
    chieuCao?: number;
    canNang?: number;
    thamNien?: number | null;
    nhomMau?: string;
    tinhTrangSucKhoe?: string;

    // Trình độ và Chứng chỉ
    laGiangVienCoHuu?: boolean | null;
    isNganSach?: boolean;
    isTinhLuong?: boolean;
    isDoTuoiLaoDong?: boolean;
    chungChiSuPhamGiangVien?: string;
    laChuyenVien?: boolean | null;
    trinhDoGiaoDucPhoThongId?: string;
    trinhDoLyLuanChinhTriId?: string;
    trinhDoQuanLyHanhChinhId?: string | null;
    trinhDoTinHocId?: string;
    danhHieuPhongTangId?: string | null;
    soTruongCongTac?: string | null;
    ngoaiNguId?: string;
    khungNangLucNgoaiNguId?: string;

    // Đảng - Đoàn
    ngayVaoDangDuBi?: string | null;
    ngayChinhThuc?: string | null;
    noiVaoDang?: string | null;
    soTheDang?: string | null;
    chucVuDangId?: string | null;
    ngayNhapNgu?: string | null;
    ngayXuatNgu?: string | null;
    donViQuanDoi?: string | null;
    chucVuQuanDoi?: string | null;
    ngayVaoDoan?: string | null;
    noiVaoDoan?: string | null;
    soTheDoan?: string | null;
    chucVuDoanId?: string | null;
    ngayThamGiaCongDoan?: string | null;
    noiThamGiaCongDoan?: string | null;
    soTheCongDoan?: string | null;

    // Tuyển dụng và Công tác
    hinhThucTuyenDungId?: string | null;
    dotTuyenDungId?: string | null;
    ngayTuyenDung?: string;
    soBaoDanh?: string | null;
    ngayBatDauLamViec?: string | null;
    ngayVaoNganh?: string | null;
    emailCanBo?: string;
    ngachTuyenDungId?: string | null;
    donViViTriTuyenDungId?: string | null;
    donViTuyenDungId?: string | null;
    anhDaiDien?: string;
    loaiHinhLamViec?: string | null;
    trinhDoQuanLyNhaNuocId?: string | null;
    urlAnhDaiDien?: string;
    donViQuanLyId?: string | null;
    donViChinhId?: string;
    loaiHoSo?: string;
    loaiHoSoKhac?: string | null;
    laGiangVienNuocNgoai?: boolean | null;
    coQuanChuQuan?: string | null;
    soGiayPhepLaoDong?: string | null;
    lichSuBanThanKhaiRo?: string | null;
    kinhNghiemThanhTich?: string | null;
    lichSuBanThanThamGia?: string | null;
    lichSuBanThanCoThanNhan?: string | null;
    loaiCanBoGiangVien?: string;
    chucDanhNgheNghiep?: string | null;
    hang?: string | null;
    maDanToc?: string;
    namDuocPhong?: number | null;
    ngayHuong?: string | null;
    tenDanToc?: string;
    maQuocTich?: string;
    tenQuocTich?: string;
    chucVuCongTac?: string | null;
    donViDangCongTac?: string | null;
    idDotCapNhat?: string;
    maTonGiao?: string;
    tenTonGiao?: string;
    soHieuVienChuc?: string | null;
    hocHam?: string | null;
    hocVi?: string | null;
    linhVucDaoTaoId?: string | null;
    linhVucDaoTaoMa?: string | null;
    soHochieu?: string | null;
    toChucCuDen?: string | null;
    thoiGianBatDauCuDen?: string | null;
    thoiGianKetThucCuden?: string | null;
    linhVuc?: string | null;
    chuyenNganh?: string | null;
    linhVucDaoTaoTen?: string | null;
    tenNghiaVuDanQuanTuVe?: string | null;
    ngayKetNapDanQuanTuVe?: string | null;
    ngayHoanThanhNghiaVu?: string | null;
    chucDanhDanQuanTuVe?: string | null;
    soQuyetDinhHoanThanh?: string | null;
    nguoiKyQuyetDinh?: string | null;
    maHeThong?: number;
    maDonViChinh?: string;
    chucVuChinhId?: string;
    maChucVuChinh?: string;
    chatLuongNhanSu?: string;
    namKyHopDong?: number | null;
    maHoSo?: string | null;
    conViTriChucDanhCoHieuLuc?: boolean;
    tinhNghiPhep?: boolean;
    donViViTriId?: string;
    trinhDoDaoTao?: string;
    isThuocDienKeKhaiHangNam?: boolean | null;
    maNganh?: string;
    trinhDoDaoTaoId?: string;
    maNoiBo?: string;
    khac?: any | null;
    tenDonViTuyenDung?: string;
    tenDonViViTriTuyenDung?: string;
    viTriUngTuyen?: string | null;
    banGoc?: boolean;
    chucDanhGiangVienId?: string | null;
    trangThaiChinhSua?: string;
    trangThaiHoSoUngTuyen?: string | null;
    ngachLuongId?: string | null;
    hoTen?: string;
    thoiGianGuiDuyet?: string;
    ngayNghi?: string | null;
    ngayBatDauLamViecTaiTruong?: string;
    yeuCauChinhSua?: string | null;
    urlFileMinhChung?: string | null;
    urlFileChungChiSuPham?: string | null;
    urlFileLyLichKhoaHoc?: string | null;
    urlFileVanBangChungChi?: string | null;
    taiLieuUngTuyen?: string | null;
    sinhMaHeThong?: boolean;
    isBanGiamDoc?: boolean;
    nganh?: string;
    tuNgay?: string | null;
    nganhId?: string | null;
    guiMail?: boolean;
    guiMailTiepNhan?: boolean;
    guiMailXetDuyet?: boolean;
    isKhoiTaoHoSoUngVien?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

    trinhDoLyLuanChinhTri?: any;
    trinhDoQuanLyHanhChinh?: any | null;
    chucVuDang?: any | null;
    chucVuDoan?: any | null;
    hinhThucTuyenDung?: any | null;
    donViTuyenDung?: any | null;
    trinhDoQuanLyNhaNuoc?: any | null;
    donViViTriTuyenDung?: any | null;
    donViChinh?: any;
    donViQuanLy?: any | null;
    tinhTrangHonNhan?: any;
    ngachTuyenDung?: any | null;
    diemTuyenDung?: any | null;
    dotTuyenDung?: any | null;
    chucVuChinh?: any;
    donViViTri?: any;
    chucDanhGiangVien?: any | null;
    ngachLuong?: any | null;

    danhSachUngTuyen?: any[];
    danhSachDonViCanBoViTri?: any[];
    danhSachThongTinTrinhDoDaoTao?: any[];
    danhSachHocHam?: any[];
    danhSachDienBienLuong?: any[];
    danhSachQuaTrinhCuDiCongTac?: any[];
    danhSachQuanHeGiaDinhVeBanThan?: any[];
    danhSachDienBienKhoan?: any[];
    danhSachPhuCapTangThem?: any[];
    danhSachDienBienPhuCap?: any[];
    danhSachDoiTuongChinhSach?: any[];
    danhSachKhenThuong?: any[];
    danhSachKyLuat?: any[];
    danhSachQuaTrinhDaoTaoBoiDuong?: any[];
    danhSachQuaTrinhCongTac?: any[];
    danhSachQuanHeGiaDinhVeBenVoChong?: any[];
    danhSachThongTinTinHoc?: any[];
    danhSachThongTinNgoaiNgu?: any[];
    danhSachThongTinTrinhDoLyLuanChinhTri?: any[];
    danhSachThongTinTrinhDoQuanLyHanhChinh?: any[];
    danhSachThongTinTrinhDoQuanLyNhaNuoc?: any[];
    danhSachBoiDuongQuocPhongAnNinh?: any[];
  }

}