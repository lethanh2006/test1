import useInitModel from "@/hooks/useInitModel";
import { ipSlink } from "@/utils/ip";

export default () => {
  const objInit = useInitModel<DanhMucChung.IRecord>('nckh/danh-muc-nckh', undefined, undefined, ipSlink);
  return {
    ...objInit,
  };
};