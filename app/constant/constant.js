'use strict';

module.exports = {
  tableEnum: {
    // ========================应用表============================
    ticket: 'ticket',
    asset_finance_info: 'asset_finance_info',
    payment: 'payment',
    payment_order: 'payment_order',
    payment_request: 'payment_request',
    purchase_order: 'purchase_order',
    purchase_return_order: 'purchase_return_order',
    sale_order: 'sale_order',
    customer: 'customer',
    supplier: 'supplier',
    supplier_product: 'supplier_product',
    warehouse: 'warehouse',
    warehouse_asset: 'warehouse_asset',
    warehouse_asset_record: 'warehouse_asset_record',
    warehouse_inventory: 'warehouse_inventory',
    warehouse_inventory_record: 'warehouse_inventory_record',
    warehouse_request: 'warehouse_request',
    // ========================高级 View============================
    view01_warehouse_inventory: 'view01_warehouse_inventory'
  },
  PURCHASE_ORDER_TYPE: {
    default: '库存采购',
    fresh: '生鲜采购',
  },
  PURCHASE_ORDER_STAUTS: {
    // 采购中
    purchasing: '采购中',
    // 订单完成
    finish: '完成',
    // 审批中
    approving: '审批中',
    // 审批失败
    approveFail: '审批失败',
  },
  TICKET_STATUS: {
    // 申请
    apply: '申请',
    // 完成
    finish: '完成',
    // 拒绝
    reject: '拒绝',
    // 同意
    agree: '同意',
    // 未审批
    unApprove: '未审批',
  },
  TICKET_TYPE: {
    // 预常规采购
    prePurchase: '预采购',
    // 预生鲜采购
    preFreshPurchase: '预生鲜采购',
  
    // 确认常规采购
    confirmPurchase: '确认采购',
    // 确认生鲜采购
    confirmFreshPurchase: '确认生鲜采购',

    // 采购退货收款
    purchaseReturnReceive: '采购退货收款',
  
    // 采购入库
    purchaseIn: '采购入库',
    // 采购资产入库
    purchaseAssetIn: '采购资产入库',
    // 采购退货出库
    purchaseReturnOut: '采购退货出库',
    // 采购资产退货出库
    purchaseAssetReturnOut: '资产退货出库',
    // 资产入库
    assetIn: '资产入库',
    // 资产领用
    assetOut: '资产领用',
    // 资产归还
    assetReturn: '资产归还',
    // 资产报废
    assetScrap: '资产报废',
    // 资产维修
    assetRepair: '资产维修',
    // 资产维修完成
    assetRepairFinish: '资产维修完成',
  
    // 采购付款
    purchasePay: '采购付款',
    // 采购退款
    purchaseRefund: '采购退款',
  
    // 采购退货
    purchaseReturn: '采购退货',
  
  }
};
