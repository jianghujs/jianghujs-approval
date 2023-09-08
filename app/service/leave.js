'use strict';
const Service = require('egg').Service;
const _ = require("lodash");
const path = require("path");
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");


class LeaveService extends Service {

  async fillInsertItemParamsBeforeHook() {
    const { userId, username } = this.ctx.userInfo;
    const tableName = "leave";
    const columnName = "idSequence";
    const idSequence = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
    });
    const leaveId = 'L' + idSequence;

    // 获取employeeId 逗号拼接字符串
    Object.assign(this.ctx.request.body.appData.actionData, {
      idSequence,
      leaveId,
      leaveUserId: userId,
    })
  }
  async assignWhereUserIdBeforeHook() {
    const { userId } = this.ctx.userInfo;
    Object.assign(this.ctx.request.body.appData.where, {
      leaveUserId: userId
    })
  }
}

module.exports = LeaveService;
