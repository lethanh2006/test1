declare module SinhVien {
  export interface IRecord {
    _id: string;
    ssoId: string;
    trangThaiHoc?: string;
    anhDaiDienUrl?: string | null;
    ma: string;
    ten: string;
    firstName: string;
    lastName: string;
    gioiTinh: any;

    quocTich: string;
    danToc: string;
    tonGiao: string;
    ngaySinh: string;
    cccd: string;
    noiCapCccd: string;
    ngayCapCccd: string;
    soDienThoai: string;
    email: string;
    // soDienThoai2: string;
    // email2: string;
    // nguoiLienLac: string;
    // soDienThoaiNguoiLienLac: string;

    loaiNoiSinh: any;
    quocGiaNoiSinh: string;
    tinhTpNoiSinh: string;
    // quanHuyenNoiSinh: string;
    // xaPhuongNoiSinh: string;

    tinhTpQueQuan: string;
    quanHuyenQueQuan: string;
    xaPhuongQueQuan: string;
    // soNhaTenDuongQueQuan: string;

    tinhTpThuongTru: string;
    quanHuyenThuongTru: string;
    xaPhuongThuongTru: string;
    soNhaTenDuongThuongTru: string;

    // laDoanVien: boolean;
    ngayVaoDoan: string;
    // daHocLopCamTinhDang: boolean;
    // laDangVien: boolean;
    ngayVaoDang: string;
    ngayVaoDangChinhThuc: string;

    soTaiKhoanNganHang: string;
    tenNganHang: string;
    chiNhanhNganHang: string;

    loaiKhuyetTat: string;
    canNang: number;
    chieuCao: number;
    soBaoHiemSinhVien: string;
    maBenhVienKhamChuaBenh: string;

    // tenGiamHo: string;
    // ngaySinhGiamHo: string;
    // ngheNghiepGiamHo: string;
    // soDienThoaiGiamHo: string;
    // emailGiamHo: string;
    // noiCongTacGiamHo: string;
    // nguyenQuanGiamHo: string;
    // diaChiGiamHo: string;
    // tenChuHo: string;

    trangThaiCha: any;
    tenCha: string;
    namSinhCha: number;
    soDienThoaiCha: string;
    ngheNghiepCha: string;
    emailCha: string;
    noiCongTacCha: string;
    nguyenQuanCha: string;
    diaChiCha: string;

    trangThaiMe: any;
    tenMe: string;
    namSinhMe: number;
    soDienThoaiMe: string;
    ngheNghiepMe: string;
    emailMe: string;
    noiCongTacMe: string;
    nguyenQuanMe: string;
    diaChiMe: string;

    tenVoChong: string;
    ngheNghiepVoChong: string;
    diaChiVoChong: string;
    soDienThoaiVoChong: string;
    emailVoChong: string;
    thongTinAnhChiEm: string;
    // thongTinCacCon: string;

    maKhoaSinhVien: string;
    khoaSinhVien?: any;
    maKhoaNganh?: string;
    khoaNganh?: any;
    lopHanhChinhList?: any[];
    maNganh: string;
    maTrinhDo: string;
    maHinhThuc: string;
    chuongTrinhId: string;

    // Thông tin tuyển sinh
    doiTuongDauVao: string;
    diemTrungTuyen: number;
    soQuyetDinhTrungTuyen: string;
    ngayKyQuyetDinhTrungTuyen: string;
    ngayNhapHoc: string;
  }

}