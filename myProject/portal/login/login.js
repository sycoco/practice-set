/**
 * Created by dongqiang on 2016/9/2.
 */
angular.module('loginApp', [])
	.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
		angular.FSS('bg', 'output');
		window.sessionStorage.clear();
		let userName,
			sign;
		try {
			userName = window.location.href.split(/#|\?|&/)[3].split('=')[1];
			sign = window.location.href.split(/#|\?|&/)[4].split('=')[1];
		} catch (error) {
			console.log('非嵌套环境');
		}

		if (userName && sign) {
			$http({
				method: 'POST',
				data: { userName, sign },
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				transformRequest: function(obj) {
					let str = [];
					for (let p in obj) {
						str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
					}
					return str.join('&');
				},
				url: '//qa-ual.fenxibao.com/loyalty2-mg/1.0/rbac/session/login',
				withCredentials: true
			}).then(() => {
				console.log('登陆成功');
				window.localStorage.setItem('username', this.loginData.username);
				location.replace('../index.html');
			});
		} else {
			this.loginData = {
				name: 'le1',
				password: 'le1'
			};
			window.CCMS_INFOS_CONFIG = {
				// UAL: 'http://bdev-nanjue.fenxibao.com',
				UAL: '',
				TENANT: 'nanjue'
			};

			this.login = function() {
				const user = {
					name: 'admin',
					password: 'ShuyunCRM123#',
					tenantId: 'cartoon',
					accountType: 'ENO'
				}


				console.log('启动登陆', getParam(user));
				function getParam(param) {
					return Object.keys(param).map(name => {
						return `${name}=${param[name]}`
					}).join('&')
				}
				fetch('/web-portal/credentials', {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
					},
					body: getParam(user)
				}).then(res => res.json()).then(res => {
					localStorage.setItem('ccmsRequestCredential', JSON.stringify(res));
					location.href = "../index.html";
				})
			}
		}
		;
		this.skipLogin = function() {
			location.replace('../index.html');
		};
		this.inputFocus = function() {
			this.errorMarkFlag = false;
		};

		function hmacsha1(x, y) {
			let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, x);
			hmac.update(y);
			let z = hmac.finalize();
			return z.toString();
		};
	}]);
