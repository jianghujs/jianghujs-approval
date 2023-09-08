'use strict';

class BizError extends Error {
  constructor({ errorCode, errorReason, errorReasonSupplement }) {
    super(JSON.stringify({ errorCode, errorReason, errorReasonSupplement }));
    this.name = 'BizError';
    this.errorCode = errorCode;
    this.errorReason = errorReason;
    this.errorReasonSupplement = errorReasonSupplement;
  }
}

const errorInfoEnum = {
  data_exception: { errorCode: 'data_exception', errorReason: '数据异常' },
  inventory_in_of_no_data: { errorCode: 'inventory_out_of_no_data', errorReason: '请填写入库数据; 入库数量不能为0' },
  inventory_out_of_no_data: { errorCode: 'inventory_out_of_no_data', errorReason: '请填写出库数据; 出库数量不能为0' },
  inventory_out_of_count_less: { errorCode: 'inventory_out_of_count_less', errorReason: '出库失败; 库存不够;' },
  inventory_out_of_empty: { errorCode: 'inventory_out_of_count_less', errorReason: '出库失败; 没有库存;' },
  payment_ticket_request_not_exist: { errorCode: 'payment_ticket_request_not_exist', errorReason: '找不到付款单' },
  payment_ticket_request_already_handle: { errorCode: 'payment_ticket_request_already_handle', errorReason: '付款单已经处理过了' },
  warehouse_ticket_request_not_exist: { errorCode: 'warehouse_ticket_request_not_exist', errorReason: '找不到入库单' },
  purchase_order_not_exist: { errorCode: 'purchase_order_not_exist', errorReason: '找不到采购单' },
  sale_order_not_exist: { errorCode: 'sale_order_not_exist', errorReason: '找不到销售单' },
  voucher_id_exist: { errorCode: 'voucher_id_exist', errorReason: '凭证号已被使用' },
  voucher_ticketId_exist: { errorCode: 'voucher_ticketId_exist', errorReason: '单据已生成过凭证' },
  return_order_not_exist: { errorCode: 'return_order_not_exist', errorReason: '找不到退货单' },
  finance_period_already_exists: { errorCode: 'finance_period_already_exists', errorReason: '会计期间已存在' },
  ticket_only_one_type: { errorCode: 'ticket_only_one_type', errorReason: '只能批量处理同一类型的工单' },
};

module.exports = {
  BizError,
  errorInfoEnum,
};
