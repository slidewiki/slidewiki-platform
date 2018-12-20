import React from 'react';
import {
    Label,
    BaseMenu,
    Menu,
    ControllerButton,
    Input,
    Item,
    ArrowIcon,
    XIcon,
    css,
    itemToString,
    getItems,
    filterItems
} from '../../lib/swAutoCompleteShared';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Flag, Icon} from 'semantic-ui-react';
import {FormattedMessage} from 'react-intl';
import uuid from 'uuid/v1';

/**
 * Renders an accessible autocomplete component, using the Downshift library.
 */
class SWAutoComplete extends React.Component {

    initialItem = null;

    constructor(props){
        super(props);

        this.state = {
            value: props.defaultValue
        };

        if(props.value) {
            this.initialItem = this.props.options.find((i) => i.value === this.props.value);
        }

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    static propTypes = {
        /** Whether the AutoComplete input is required. */
        required: PropTypes.bool,
        /** Dropdown selection options. Must be an array of objects, each with 'text' and 'value' attributes. */
        options: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
            icon: PropTypes.instanceOf([Icon, Flag]),
        })).isRequired,
        /** Label to be rendered with the component. */
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(FormattedMessage)]),
        /** A placeholder that should be rendered in the <input>. */
        placeholder: PropTypes.string,
        /** Whether the element is in an error state. */
        error: PropTypes.bool,
        /** The pre-set value of the <input>. */
        defaultValue: PropTypes.string,
        /** The name of the input. Passed when this Component triggers events. */
        name: PropTypes.string,
        /** Function to run on the onChange event. */
        onChange: PropTypes.func,
        /** Text for an associated ARIA described-by element. */
        ariaDescription: PropTypes.string
    };

    /**
     * Handles the value change event for this component.
     * Exists only to trigger a React-compatible event up to the parent component.
     * Sends the value (id) of the selected item in the Autocomplete,
     * or null if the Autocomplete was cleared.
     *
     * @returns {void}
     */
    handleOnChange(selectedItem, stateAndHelpers) {
        this.setState({value: selectedItem.value});
        this.props.onChange({
            target: {
                name: this.props.name,
                value: (selectedItem ? selectedItem.value : null)
            }
        });
    }

    render() {
        // Generate classes for the wrapping element
        let wrapperClasses = classNames({
            field: true,
            required: this.props.required,
            error: this.props.error,
        });

        let describedBy = this.props.ariaDescription ? <div className="sr-only" id={uuid()}>
            {this.props.ariaDescription}
        </div> : null;

        return (
            <div className={wrapperClasses}>
                {describedBy}
                <Downshift
                    onChange={this.handleOnChange}
                    itemToString={itemToString}
                    initialSelectedItem={this.initialItem}
                    initialInputValue={itemToString(this.initialItem)}
                >
                    {({
                          getLabelProps,
                          getInputProps,
                          getToggleButtonProps,
                          getMenuProps,
                          getItemProps,
                          isOpen,
                          clearSelection,
                          selectedItem,
                          inputValue,
                          highlightedIndex,
                      }) => (
                        <div>
                            <Label {...getLabelProps()}>{this.props.label}</Label>
                            <div {...css({position: 'relative'})}>
                                <Input
                                    {...getInputProps({
                                        isOpen,
                                        placeholder: this.props.placeholder,
                                        autoComplete: 'nope'
                                    })}
                                    aria-describedby={(describedBy ? describedBy.props.id : null)}
                                />
                                {selectedItem ? (
                                    <ControllerButton
                                        onClick={clearSelection}
                                        aria-label="clear selection"
                                    >
                                        <XIcon />
                                    </ControllerButton>
                                ) : (
                                    <ControllerButton {...getToggleButtonProps()}>
                                        <ArrowIcon isOpen={isOpen} />
                                    </ControllerButton>
                                )}
                            </div>
                            <div {...css({position: 'relative', zIndex: 9})}>
                                <BaseMenu {...getMenuProps({isOpen})}>
                                    {isOpen
                                        ? filterItems(inputValue, this.props.options).map((item, index) => (
                                            <Item
                                                key={index}
                                                {...getItemProps({
                                                    item,
                                                    index,
                                                    isActive: highlightedIndex === index,
                                                    isSelected: selectedItem === item,
                                                })}
                                            >
                                                {itemToString(item)}
                                            </Item>
                                        ))
                                        : null}
                                </BaseMenu>
                            </div>
                        </div>
                    )}
                </Downshift>
            </div>
        );
    }
}

export default SWAutoComplete;
