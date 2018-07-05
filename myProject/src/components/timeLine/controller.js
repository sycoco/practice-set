/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-06-06 11:41
 */

export default class TimeLineController {
	constructor() {
		const DEFAULT_OPTIONS = {
			type: 'horizontal',
			currentState: 0,
			stateList: [],
			symbol: ''
		};

		this.type = this.type === 'vertical' ? this.type : DEFAULT_OPTIONS.type;
		this.currentState = typeof this.currentState === 'undefined' ? DEFAULT_OPTIONS.currentState : this.currentState;
		this.stateList = this.stateList ? [...this.stateList] : DEFAULT_OPTIONS.stateList;
		this.symbol = typeof this.symbol === 'undefined' ? DEFAULT_OPTIONS.symbol : this.symbol;
	}
}
