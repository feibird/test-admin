angular.module('index_area').factory('PremResource', PremResource);
PremResource.$inject = ['$http', 'device', 'version'];
function PremResource($http, device, version) {
  return {
		  list: list,
    add: add,
    get: get,
    update: update,
    remove: remove
  };

  function list(seid, skip, limit) {
    return $http.get("/api-admin/gift/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
      return data
    })
  }

  function get(seid, id) {
    return $http.get("/api-admin/gift/get", { params: { "device": device, "version": version, "sessionId": seid, 'id': id } }).then(function (data) {
      return data
    })
  }

  function update(seid, obj) {
    return $http({
      url: "/api-admin/gift/update",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "id": obj.id,
        "name": obj.name,
        "specId": obj.specs,
        "cost": obj.cost
      }
    })
      .then(function (data) {
        return data
      })
  }

  function add(seid, obj) {
    return $http({
      url: "/api-admin/gift/add",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "name": obj.name,
        "specId": obj.specs,
        "cost": obj.cost
      }
    })
      .then(function (data) {
        return data
      })
  }


  function remove(seid, id) {
    return $http({
      url: "/api-admin/gift/remove",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "id": id
      }
    })
      .then(function (data) {
        return data
      })
  }

}