import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

import util from '@parity/api/util';
import { nodeOrStringProptype } from '@parity/shared/util/proptypes';
import { isNullAddress } from '@parity/shared/util/validation';

// import IdentityIcon from '@parity/ui/IdentityIcon';
import Input from './Input';

// import styles from './inputAddress.css';

class InputAddress extends Component {
		static propTypes = {
			account: PropTypes.object,
			allowCopy: PropTypes.bool,
			autoFocus: PropTypes.bool,
			allowInvalid: PropTypes.bool,
			className: PropTypes.string,
			disabled: PropTypes.bool,
			error: PropTypes.string,
			focused: PropTypes.bool,
			hideUnderline: PropTypes.bool,
			hint: nodeOrStringProptype(),
			label: nodeOrStringProptype(),
			onChange: PropTypes.func,
			onClick: PropTypes.func,
			onFocus: PropTypes.func,
			onSubmit: PropTypes.func,
			readOnly: PropTypes.bool,
			small: PropTypes.bool,
			tabIndex: PropTypes.number,
			text: PropTypes.bool,
			value: PropTypes.string
		};

		static defaultProps = {
			allowCopy: true,
			hideUnderline: false,
			small: false
		};

		render () {
			const { account, allowCopy, autoFocus, className, disabled, error, focused, hint } = this.props;
			const { hideUnderline, label, onClick, onFocus, readOnly, small } = this.props;
			const { tabIndex, text, value } = this.props;
			const icon = this.renderIcon();
			const classes = [ className ];

			classes.push(!icon ? styles.inputEmpty : styles.input);

			const containerClasses = [ styles.container ];
			const nullName = (disabled || readOnly) && isNullAddress(value)
				? 'null'
				: null;

			// FIXME: The is not advisable, fixes the display issue, however the name should come from
			// a common component.
			//    account.name || (value ? 'UNNAMED' : value)
			const displayValue = text && account
				? (account.name || (value ? 'UNNAMED' : value))
				: (nullName || value);

			if (small) {
				containerClasses.push(styles.small);
			}

			const props = {};

			if (!disabled) {
				props.focused = focused;
			}

			return (
				<div className={ containerClasses.join(' ') }>
					<Input
						allowCopy={ allowCopy && ((disabled || readOnly) ? value : false) }
						autoFocus={ autoFocus }
						className={ classes.join(' ') }
						disabled={ disabled }
						error={ error }
						hideUnderline={ hideUnderline }
						hint={ hint }
						label={ label }
						onChange={ this.onChange }
						onClick={ onClick }
						onFocus={ onFocus }
						onSubmit={ this.onSubmit }
						readOnly={ readOnly }
						tabIndex={ tabIndex }
						value={ displayValue }
						{ ...props }
					/>
					{ icon }
				</div>
			);
		}

		renderIcon () {
			const { allowInvalid, value, disabled, label, allowCopy, hideUnderline, readOnly } = this.props;

			if (!value || !value.length || (!util.isAddressValid(value) && !allowInvalid)) {
				return null;
			}

			const classes = [(disabled || readOnly) ? styles.iconDisabled : styles.icon];

			if (!label) {
				classes.push(styles.noLabel);
			}

			if (!allowCopy) {
				classes.push(styles.noCopy);
			}

			if (hideUnderline) {
				classes.push(styles.noUnderline);
			}

			return (
				<div className={ classes.join(' ') }>

					{ /* <IdentityIcon
          address={ value }
          center
          inline
        /> */}
				</div>
			);
		}

		onChange = (event, _value) => {
			let address = _value.trim();
			const isEmpty = (address.length === 0);

			this.setState({ isEmpty });

			if (this.props.onChange) {
				if (!/^0x/.test(address) && util.isAddressValid(`0x${address}`)) {
					address = `0x${address}`;
				}

				this.props.onChange(event, address);
			}
		}

		onSubmit = (_value) => {
			const address = _value.trim();

			if (this.props.onSubmit) {
				this.props.onSubmit(address);
			}
		}
}

module.exports = { InputAddress }
// function mapStateToProps (state, props) {
//   const { text, value } = props;

//   if (!text || !value) {
//     return {};
//   }

//   const lcValue = value.toLowerCase();
//   const { accountsInfo } = state.personal;
//   const { tokens } = state;

//   const accountInfo = Object.values(accountsInfo).find((account) => account.address.toLowerCase() === lcValue);
//   const token = Object.values(tokens).find((token) => token.address.toLowerCase() === lcValue);

//   const account = accountInfo || token || null;

//   return {
//     account
//   };
// }

// export default connect(
//   mapStateToProps,
//   null
// )(InputAddress);
