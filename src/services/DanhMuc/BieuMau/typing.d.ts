import { EKieuDuLieu, ELoaiLoaiHinh, ELoaiPhepToan, ELoaiQuyDoiGio, ELoaiThoiGianThucHien, ELoaiTinhGioThanhVien, ELoaiTruongThongTinTinh, ETextDisplay, LoaiDefaultValue } from "@/services/DanhMuc/BieuMau/constant";

declare module BieuMau {
  export interface IRecord {
    _id: string;
    ten: string;
    ma: string;
    cauHinhLoaiHinh: TruongThongTin[];
    fileId: string;
    file: { name: string }[];
    [key: string]: any;
  }


  export interface Cot {
    ten: string;
    ma: string;
    kieuDuLieu: EKieuDuLieu;
    textDisplay: ETextDisplay;
    maDanhMuc: string;
    kichHoat: boolean;
    batBuoc: boolean;
    truongThongTinLienQuan: string;
    giaTriLienQuan: any;
    danhSachCot: Cot[];
    laDangMang: boolean;
    colspan: number;
    danhSachCotHienThi: string[];
    loaiDefaultValue: LoaiDefaultValue;
    layDuLieuTu: string;
    truongLayDuLieu: string;
    maFormLayDefaultValue: string;
    maFieldLayDefaultValue: string;
    danhSachFileDinhKem: string[];
    ghiChuFileDinhKem: string;
    readonly: boolea;
    ghiChu: string;
    customDefaultValue: string;

    dataPartitionCode: string;
    thamDinh?: any[];
  }

  export interface TruongThongTin {
    customDefaultValue: string;
    ten: string;
    ma: string;
    ghiChu: string;
    kieuDuLieu: EKieuDuLieu;
    textDisplay: ETextDisplay;
    maDanhMuc: string;
    danhSachCot: Cot[];
    kichHoat: boolean;
    batBuoc: boolean;
    truongThongTinLienQuan: string;
    giaTriLienQuan: any;
    colspan: number;
    danhSachCotHienThi: string[];
    laDangMang: boolean;
    loaiDefaultValue: LoaiDefaultValue;
    maFormLayDefaultValue: string;
    maFieldLayDefaultValue: string;
    layDuLieuTu: string;
    truongLayDuLieu: string;
    danhSachFileDinhKem: string[];
    ghiChuFileDinhKem: string;
    readonly: boolean;
    ghiChu: string;

    dataPartitionCode: string;
    thamDinh?: any[];
  }

  export interface TieuChi {
    index: number;
    maTruongThongTin: string;
    maCot: string;
    loaiPhepToan: ELoaiPhepToan;
    value: any;
  }

  export interface QuyDoiThanhVien {
    index: number;
    loaiTinhGioThanhVien: ELoaiTinhGioThanhVien;
    moTa: string;
    danhSachVaiTro: string[];
    choMoiNguoi: boolean;
    giaTri?: number;
    phanTram?: number;
    wrong?: boolean;
  }

  export interface DieuKienQuyDoi {
    index: number;
    moTa: string;
    loaiQuyDoiGio: ELoaiQuyDoiGio;
    congThucCustom: any;
    tieuChi: TieuChi[];
    gioTong: number;
    maTruongThongTinHeSo: string;
    heSo: number;
    chiaDeuChoCacThanhVien: boolean;
    heSoTheoNamHoc: boolean;
    quyDoiThanhVien: QuyDoiThanhVien[];
    active: boolean;
  }

  export interface DieuKienQuyDoi {
    index: number;
    moTa: string;
    loaiQuyDoiGio: ELoaiQuyDoiGio;
    congThucCustom: any;
    tieuChi: TieuChi[];
    gioTong: number;
    maTruongThongTinHeSo: string;
    heSo: number;
    chiaDeuChoCacThanhVien: boolean;
    heSoTheoNamHoc: boolean;
    quyDoiThanhVien: QuyDoiThanhVien[];
    active: boolean;
  }

  export interface SanPhamLienQuan {
    label: string;
    itSelf: boolean;
  }

  export interface ILoaiHinhRecord {
    danhSachCotHienThi: string[];
    _id: string;
    ten: string;
    loai: ELoaiLoaiHinh;
    kichHoat: boolean;
    khaiBao1Lan: boolean;
    hienThiRieng: boolean;
    tuDongDuyet: boolean;
    danhSachVaiTroThanhVienKhaDung: string[];
    danhSachCauHinhTruongThongTinTinh: CauHinhTruongThongTinTinh[];
    loaiThoiGianThucHien: ELoaiThoiGianThucHien;
    soLanGiaHan: number;
    cauHinhLoaiHinh: TruongThongTin[];
    createdAt: string;
    startLabel: string;
    endLabel: string;
    timelineLabel: string;
    danhSachHeSo: number[];
    danhSachDieuKienQuyDoi: DieuKienQuyDoi[];
    danhSachDieuKienQuyDoiDiem: DieuKienQuyDoi[];
    danhSachCauHinhSanPhamLienQuan: SanPhamLienQuan;
    searchKey1: string;
    searchKey2: string;
    tinhDiem?: boolean;
  }

  export interface CauHinhTruongThongTinTinh {
    loaiTruongThongTinTinh: ELoaiTruongThongTinTinh;
    label: string;
    maTruongThongTinDungSau: string;
    colspan: string;
  }
}