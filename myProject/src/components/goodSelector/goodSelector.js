/**
 * @author Jocs
 * @since 2016-11-24
 */
import controller from './controller';

selectorFactory.$inject = ['$ccModal', '$rootScope'];

import body from './template/modalBody.html';

export default function selectorFactory($ccModal, $rootScope) {
	const ccModal = $ccModal.modal;
	const scope = $rootScope.$new();

	return function(shopId, goodIds, lookup) {
		return ccModal({
			title: '商品选择',
			scope,
			body,
			controller,
			locals: {
				data: { shopId, goodIds, lookup }
			},
			controllerAs: '$ctrl',
			style: {
				'width': '920px',
				'min-width': '920px',
				'height': '436px',
				'min-height': '436px'
			}
		}).open().result;
	};
}
