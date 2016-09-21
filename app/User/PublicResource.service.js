angular.module('index_area').factory('PublicResource', PublicResource);
PublicResource.$inject = ['$http', 'device', 'version'];
function PublicResource($http, device, version) {
    return {
        seid: seid,
        user: user,
        Urllogin: Urllogin,
		getarea: getarea,
		logout: logout,
		RoleUser: RoleUser
    };


    /**
     *获取sessionID 
     * @param {Object} user
     * 登录用户名
     */
	function seid(user) {
		return $.session.get(user);
	}


	/**
	 * 获取user信息
	 * seid:当前sessionID
	 */
	function user(seid) {
		return $.ajax({
			type: "get",
			url: "/api-admin/session/get-user-info",
			async: false,
			data: { "sessionId": seid, "device": device, "version": version },
			dataType: "json",
			success: function (data) {
				return data
			}
		});
	}

	function RoleUser(seid, userid) {
		return $.ajax({
			type: "get",
			url: "/api-admin/authority/user/roles",
			async: false,
			data: { "sessionId": seid, "device": device, "version": version, "userId": userid },
			dataType: "json",
			success: function (data) {
				return data
			}
		});
	}


	/**
	 * 跳转到登录页
	 */
	function Urllogin() {
		window.location.href = "../User/login.html";
	}


	//退出
	function logout(seid) {
		return $.ajax({
			type: "post",
			url: "/api-admin/session/logout",
			async: false,
			data: { "sessionId": seid, "device": device, "version": version },
			dataType: 'json',
			success: function (data) {
				return data;
			}
		})
	}

	/**
	 * 地区查询
	 */
	function getarea(seid, id) {
		return $.ajax({
			type: "get",
			url: "/api-admin/area/list-by-parentId",
			async: false,
			data: { "sessionId": seid, "device": device, "version": version, "parentId": id },
			dataType: "json",
			success: function (data) {
				return data;
			}
		})
	}


}