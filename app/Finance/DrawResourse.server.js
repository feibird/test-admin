/**
 * 提供财务功能API封装
 */
angular.module('index_area').factory('DrawResource', DrawResource);
DrawResource.$inject = ['$http', 'device', 'version'];

function DrawResource($http, device, version) {
  return {
    list: list,
    get: get,
    update: update,
    complete: complete,
    operaOk: operaOk,
    operaNo: operaNo,
    FinanNo: FinanNo,
    FinanOk: FinanOk,
    count: count
  };


  /**
   * list
   * 获取门店列表
   */
  function list(seid, obj, skip, limit) {
    return $http.get("/api-admin/draw/list", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "skip": skip,
        "limit": limit,
        'storeId': obj.storeId,
        'status': obj.status,
        "applyStartDate": obj.applyStartDate,
        "applyEndDate": obj.applyEndDate,
        "completeStartDate": obj.completeStartDate,
        "completeEndDate": obj.completeEndDate,
        "serialNumber": obj.serialNumber
      }
    }).then(function (data) {
      return data
    })
  }

  /**
   * 修改信息
   * @param {Object} id
   * @param {Object} seid
   * @param {Object} name
   */
  function update(seid, status, id) {
    return $http({
      url: "/api-admin/draw/" + id + "/update",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "status": status,
        "device": device,
        "version": version,
        "sessionId": seid
      }
    })
      .then(function (data) {
        return data;
      })
  }

  /**
   * 获取某个订单
   */
  function get(seid, id) {
    return $http.get("/api-admin/draw/" + id + "/get", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid
      }
    }).then(function (data) {
      return data
    })
  }

  //确认打款
  function complete(seid, obj) {
    if (typeof (obj.ids) == 'undefined') {
      var ids = obj.id
    } else {
      var ids = arry(obj.ids);
    }
    return $http({
      url: "/api-admin/draw/complete",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "ids": ids,
        "device": device,
        "version": version,
        "sessionId": seid,
        "remark": obj.remark
      }
    })
      .then(function (data) {
        return data;
      })
  }

  //运营审核通过
  function operaOk(seid, obj) {
    if (typeof (obj.ids) == 'undefined') {
      var ids = obj.id
    } else {
      var ids = arry(obj.ids);
    }
    return $http({
      url: "/api-admin/draw/approve-operate",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "ids": ids,
        "remark": obj.remark
      }
    })
      .then(function (data) {
        return data;
      })
  }

  //运营审核失败
  function operaNo(seid, obj) {
    if (typeof (obj.ids) == 'undefined') {
      var ids = obj.id
    } else {
      var ids = arry(obj.ids);
    }

    return $http({
      url: "/api-admin/draw/reject-operate",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "ids": ids,
        "remark": obj.remark
      }
    })
      .then(function (data) {
        return data;
      })
  }

  //财务审核不通过
  function FinanNo(seid, obj) {
    if (typeof (obj.ids) == 'undefined') {
      var ids = obj.id
    } else {
      var ids = arry(obj.ids);
    }
    return $http({
      url: "/api-admin/draw/reject-finance",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "ids": ids,
        "remark": obj.remark
      }
    })
      .then(function (data) {
        return data;
      })
  }

  //财务审核通过
  function FinanOk(seid, obj) {
    if (typeof (obj.ids) == 'undefined') {
      var ids = obj.id
    } else {
      var ids = arry(obj.ids);
    }
    return $http({
      url: "/api-admin/draw/approve-finance",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "ids": ids,
        "remark": obj.remark
      }
    })
      .then(function (data) {
        return data;
      })
  }


  function count(seid, obj, skip, limit) {
    console.log(obj);
    return $http.get("/api-admin/draw/sum", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "skip": skip,
        "limit": limit,
        'storeId': obj.storeId,
        'status': obj.status,
        "applyStartDate": dateTime(obj.applyStartDate) ? dateTime(obj.applyStartDate) : null,
        "applyEndDate": dateTime(obj.applyEndDate) ? dateTime(obj.applyEndDate) : null,
        "completetStartDate": dateTime(obj.completetStartDate) ? dateTime(obj.completetStartDate) : null,
        "completeEndDate": dateTime(obj.completeEndDate) ? dateTime(obj.completeEndDate) : null,
        "serialNumber": obj.serialNumber
      }
    }).then(function (data) {
      return data
    })
  }

  //将数组组成字符串
  function arry(obj) {
    if (typeof (obj) == "undefined") {
      return obj
    }
    var ids = "";
    for (var i in obj) {
      ids += obj[i] + ","
    }
    console.log(ids);
    ids = ids.substring(0, ids.length - 1);

    return ids;
  }

  //修改时间格式(时间戳转换)
  function dateTime(data) {
    if (data == null || data.length < 1) {
      return false;
    }
    console.log(data)
    var date = data.split('-');
    console.log(date);
    var time = new Date(date[0], date[1] - 1, date[2]).getTime();
    return time;
  }


}