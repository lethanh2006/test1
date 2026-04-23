import useInitModel from '@/hooks/useInitModel';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<BieuMau.IRecord>('form-dong');

  const [editCauHinh, setEditCauHinh] = useState<boolean>(false);
  const [recordCauHinh, setRecordCauHinh] = useState<BieuMau.TruongThongTin>();

  const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
  const [recordLoaiHinh, setRecordLoaiHinh] = useState<BieuMau.ILoaiHinhRecord>();

  const [editCot, setEditCot] = useState<boolean>(false);
  const [recordCot, setRecordCot] = useState<BieuMau.Cot>();
  //Dot khai bao
  const [visibleDot, setVisibleDot] = useState<boolean>(false);
  const [recordQuyTrinhForm, setRecordQuyTrinhForm] = useState<any>();

  return {
    ...objInit,

    //state
    editCot,
    recordCot,
    editCauHinh,
    recordCauHinh,
    visiblePreview,
    recordLoaiHinh,
    visibleDot,
    recordQuyTrinhForm,

    //setState
    setEditCot,
    setRecordCot,
    setEditCauHinh,
    setRecordCauHinh,
    setVisiblePreview,
    setRecordLoaiHinh,
    setVisibleDot,
    setRecordQuyTrinhForm,
  };
};