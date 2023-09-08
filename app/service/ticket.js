const Service = require('egg').Service;
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
const { BizError, errorInfoEnum } = require('../constant/error');
const { tableEnum } = require('../constant/constant');
const _ = require('lodash');
const dayjs = require('dayjs');

const actionDataScheme = Object.freeze({
  createTicket: {
    type: 'object',
    additionalProperties: true,
    required: ['ticketType', 'ticketContentRequest'],
    properties: {
      ticketType: { type: "string", enum: ['默认类型'] },
      ticketContentRequest: { type: 'object' },
      ticketRequestAmount: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  },

  // Reference: ./ticketContent/采购付款.json
  '默认类型': {
    type: 'object',
    // additionalProperties: true,
    // required: ['supplierInfo', 'purchaseOrderId', 'purchaseOrderType', 'purchaseCreateAt', 'purchaseTotalAmount', 'purchasePaidAmount', 'deductionAmount'],
    // properties: {}
  },
})

class TicketService extends Service {

  async getIdSequence({ table, startValue = 1001 }) {
    const tableName = tableEnum[table];
    const columnName = "idSequence";
    const idSequence = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
      startValue,
    });
    return idSequence;
  }

  async createTicketHook() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    const {workflowId} = this.ctx.request.body.appData.workflowData;
    const workflow = await jianghuKnex('workflow').where({ workflowId }).first();
    const workflowConfig = JSON.parse(workflow.workflowConfig);
    const ticketAuditUserIdList = workflowConfig.nodeList.map(e => e.userId);
    await this.createTicket([{
      ticketBizId: actionData.leaveId,
      ticketType: '默认类型',
      ticketRequestAmount: 0,
      ticketContentRequest: actionData,
      ticketAuditUserIdList: ticketAuditUserIdList.join(','),
      ticketAuditConfig: JSON.stringify({
        ticketAuditUserIdList,
        ticketAuditedUserIdList: [],
      }),
    }]);
  }

  async createTicket(dataList) {
    const { ctx } = this;
    const { jianghuKnex } = this.app;
    const { userId, username } = ctx.userInfo;

    let idSequence = await this.getIdSequence({ table: 'ticket', startValue: 10001 });
    const insertData = _.map(dataList, item => {
      let { ticketBizId, ticketType, ticketRequestAmount, ticketContentRequest, ticketAuditUserIdList, ticketAuditConfig } = item;

      validateUtil.validate(actionDataScheme.createTicket, item);
      validateUtil.validate(actionDataScheme[ticketType], ticketContentRequest, '工单内容');

      const ticket = {
        idSequence,
        ticketId: `T${idSequence}`,
        ticketBizId, ticketType, ticketRequestAmount,
        ticketContentRequest: JSON.stringify(_.omit(ticketContentRequest, ['operation', 'operationByUserId', 'operationByUser', 'operationAt'])),
        ticketRequestAt: dayjs().format(),
        ticketRequestByUserId: userId,
        ticketRequestByUser: username,
        ticketAuditUserIdList,
        ticketAuditConfig,
      }
      idSequence += 1;

      return ticket;
    })

    await jianghuKnex('ticket', ctx).insert(insertData);
  }


  async handleTicket() {
    const { jianghuKnex } = this.app;
    const {dataList, ticketStatus} = this.ctx.request.body.appData.actionData;
    await this.handleTicketList(dataList, ticketStatus);
  }

  // 处理采购申请单
  async handleTicketList(ticketList, ticketStatus) {
    const { jianghuKnex } = this.app;
    const { userId, username } = this.ctx.userInfo;

    const ticketTypeList = _.uniq(ticketList.map(e => e.ticketType));
    if (ticketTypeList.length !== 1) {
      // 只能批量处理同一类型的工单
      throw new BizError(errorInfoEnum.ticket_only_one_type);
    }
    const ticketUpdateList = [];
    for (const ticket of ticketList) {
      const { ticketId, ticketAuditUserIdList, ticketAuditedUserIdList } = ticket;
      const ticketAuditUserIdListStr = ticketAuditUserIdList.filter(e => e !== userId).join(',')
      //处理 ticket 数据 
      ticketUpdateList.push({
        ticketId,
        // 排除掉自己
        ticketAuditUserIdList: ticketAuditUserIdListStr,
        ticketAuditedUserIdList: ticketAuditedUserIdList.concat(userId).join(','),
        ticketStatus: ticketStatus == '完成' ? !ticketAuditUserIdListStr ? '完成' : '处理中' : ticketStatus, 
        ticketStatusAt: dayjs().format(), 
        ticketStatusByUserId: userId, 
        ticketStatusByUser: username,
      })
    }





    //事务处理
    await jianghuKnex.transaction(async trx => {

      //更新 ticket
      for(const item of ticketUpdateList){
        await trx('ticket').where({ ticketId: item.ticketId }).jhUpdate(item);
      }

    });

  }
}

module.exports = TicketService;