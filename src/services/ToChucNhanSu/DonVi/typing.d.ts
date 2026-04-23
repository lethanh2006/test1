
declare module DonVi {

  export interface IRecord {
    _id: string;
    ten: string;
    maDonVi: string;
    donViChaId: string | null;
    loaiPhongBanId: string;
    loaiHinhDonVi: string;
    laDonViThucTe: boolean;
    soQuyetDinhThanhLap: string;
    tenVietTat: string;
    ngayRaQuyetDinh: string; // Hoặc Date nếu bạn parse nó
    diaChiDonVi: string | null;
    sdtDonVi: string | null;
    isBanGiamDoc: boolean | null;
    isDonViSinhMa: boolean | null;
    emailDonVi: string | null;
    loaiTrucThuoc: string | null;
    coSo: string | null;
    urlFileUpload: string | null;
    moTa: string | null;
    chucDanhKiemNhiem: string | null;
    hienThi: boolean;
    loaiTuChuTaiChinh: string;
    dataPartitionCode: string | null;
    createdAt: string;
    updatedAt: string;

    loaiPhongBan: any;
    donViCha: any | null;
    danhSachDonViCon: any[];
    danhSachDonViViTri: any[];
    danhSachNhanSuDonViChinh: any[];
  }
}