/**
 * Created by liwenjie on 2016/10/13.
 */

import {Inject} from 'angular-es-utils';


@Inject('$state')
export default class RuleEditorController {

	constructor() {
		this.expand = this.expand || true;
	}

	clickBar() {
		this.expand = !this.expand;
	}
}
