angular.module('index_area').factory('MusicResource', MusicResource);
MusicResource.$inject = ['$http', 'device', 'version'];
function MusicResource($http, device, version) {
    return {
        list: list,
        add: add,
        update: update,
        remove: remove,
        get: get,
        status: status,
        count: count
    };

    function list(seid, skip, limit) {
        return $http.get("/api-admin/voice/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
            return data
        })
    }

    function get(seid, id, skip, limit) {
        return $http.get("/api-admin/voice/get", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit, "voiceId": id } }).then(function (data) {
            return data
        })
    }

    function status(seid, obj) {
        return $http({
            url: "/api-admin/voice/update-status",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "ids": obj.ids,
                "effective": obj.status
            }
        })
            .then(function (data) {
                return data
            })
    }

    function add(seid, obj) {
        console.log(obj)
        return $http({
            url: "/api-admin/voice/add",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "name": obj.name,
                "effective": obj.effective,
                "type": "SYSTEM",
                "content": obj.content,
                "allStore": obj.allStore,
                "storeIds": obj.storeId,
                "dates": JSON.stringify(obj.dates),
                "times": JSON.stringify(obj.times)
            }
        })
            .then(function (data) {
                return data
            })
    }

    function update(seid, obj) {
        return $http({
            url: "/api-admin/voice/update",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "name": obj.name,
                'id': obj.id,
                "effective": obj.effective,
                "type": "SYSTEM",
                "content": obj.content,
                "allStore": obj.allStore,
                "storeIds": obj.storeId,
                "dates": JSON.stringify(obj.voiceDates),
                "times": JSON.stringify(obj.voiceTimes)
            }
        })
            .then(function (data) {
                return data
            })
    }

    function remove(seid, ids) {
        return $http({
            url: "/api-admin/voice/remove",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "ids": ids
            }
        })
            .then(function (data) {
                return data
            })
    }

    function count(seid) {
        return $http.get("/api-admin/voice/count", { params: { "device": device, "version": version, "sessionId": seid } }).then(function (data) {
            return data
        })
    }

}