export enum DataConditionType {
  STRING = 'Chữ',
  NUMBER = 'Số',
  BOOLEAN = 'Logic',
  DATE = 'Thời gian',
}

export enum DataConditionOperator {
  EQUAL = 'Bằng',
  NOT_EQUAL = 'Khác',
  GREATER = 'Lớn hơn',
  GREATER_EQUAL = 'Lớn hơn hoặc bằng',
  LESS = 'Nhỏ hơn',
  LESS_EQUAL = 'Nhỏ hơn hoặc bằng',
  CONTAIN = 'Chứa',
  NOT_CONTAIN = 'Không chứa',
  EMPTY = 'Rỗng',
  NOT_EMPTY = 'Không rỗng',
  BEFORE = 'Trước',
  AFTER = 'Sau',
  TODAY = 'Hôm nay',
  THIS_WEEK = 'Tuần này',
  THIS_MONTH = 'Tháng này',
  THIS_YEAR = 'Năm nay',
  IS_TRUE = 'Là đúng',
  IS_FALSE = 'Là sai',
}

export const getOperatorsForType = (type: DataConditionType): DataConditionOperator[] => {
  switch (type) {
    case DataConditionType.STRING:
      return [
        DataConditionOperator.EQUAL,
        DataConditionOperator.NOT_EQUAL,
        DataConditionOperator.CONTAIN,
        DataConditionOperator.NOT_CONTAIN,
        DataConditionOperator.EMPTY,
        DataConditionOperator.NOT_EMPTY,
      ];
    case DataConditionType.NUMBER:
      return [
        DataConditionOperator.EQUAL,
        DataConditionOperator.NOT_EQUAL,
        DataConditionOperator.GREATER,
        DataConditionOperator.GREATER_EQUAL,
        DataConditionOperator.LESS,
        DataConditionOperator.LESS_EQUAL,
      ];
    case DataConditionType.BOOLEAN:
      return [DataConditionOperator.IS_TRUE, DataConditionOperator.IS_FALSE];
    case DataConditionType.DATE:
      return [
        DataConditionOperator.EQUAL,
        DataConditionOperator.NOT_EQUAL,
        DataConditionOperator.BEFORE,
        DataConditionOperator.AFTER,
        DataConditionOperator.TODAY,
        DataConditionOperator.THIS_WEEK,
        DataConditionOperator.THIS_MONTH,
        DataConditionOperator.THIS_YEAR,
      ];
    default:
      return [];
  }
};

export const needsRightValue = (operator: DataConditionOperator): boolean => {
  const noValueOperators = [
    DataConditionOperator.EMPTY,
    DataConditionOperator.NOT_EMPTY,
    DataConditionOperator.TODAY,
    DataConditionOperator.THIS_WEEK,
    DataConditionOperator.THIS_MONTH,
    DataConditionOperator.THIS_YEAR,
    DataConditionOperator.IS_TRUE,
    DataConditionOperator.IS_FALSE,
  ];
  return !noValueOperators.includes(operator);
};
