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
} from './SWAutocompleteShared';
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

    constructor(props){
        super(props);

        this.state = {
            value: props.defaultValue,
            initialItem: props.defaultValue ?
                this.props.options.find((i) => i.value === this.props.defaultValue)
                : null,
        };

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    static propTypes = {
        /** Whether the AutoComplete input is required. */
        required: PropTypes.bool,
        /** Dropdown selection options. Must be an array of objects, each with 'text' and 'value' attributes. */
        options: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
            icon: PropTypes.element, //instanceOf([Icon, Flag])
        })).isRequired,
        /** Label to be rendered with the component. */
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
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
        ariaDescription: PropTypes.string,
        /** The width in columns of the Component. */
        width: PropTypes.string,
        /** Error message */
        errorMessage: PropTypes.element,
    };

    // When new props are set, this update the state and changes the item selected in Downshift.
    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.defaultValue,
            initialItem: newProps.defaultValue ?
                this.props.options.find((i) => i.value === newProps.defaultValue)
                : null,
        });

        // If the new defaultValue has changed, select the corresponding option in Downshift.
        if(newProps.defaultValue !== this.props.defaultValue)
            this.refs.downshift.selectItem(this.props.options.find((i) => i.value === newProps.defaultValue));
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
        // If an item was selected, the set it in state. No selectedItem means the input has been cleared.
        this.setState({value: selectedItem ? selectedItem.value : null });

        // Forward the event to an onChange handler, if one is registered.
        if(this.props.onChange) this.props.onChange({
            target: {
                id: this.props.id,
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
            [this.props.width]: this.props.width,
            wide: this.props.width,
        });

        // If ariaDescription is set, generate an element to contain an aria-describedBy description.
        let describedBy = this.props.ariaDescription ? <div className="sr-only" id={uuid()}>
            {this.props.ariaDescription}
        </div> : null;

        return (
            <div className={wrapperClasses}>
                {describedBy}
                <Downshift
                    onChange={this.handleOnChange}
                    itemToString={itemToString}
                    initialSelectedItem={this.state.initialItem}
                    initialInputValue={itemToString(this.state.initialItem)}
                    ref='downshift'
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
                          id,
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
                                    aria-required={this.props.required}
                                    aria-invalid={this.props.error}
                                    aria-labelledby={`${id}-label ${this.props.errorMessage ? id + '-error' : ''}`}
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
                                        : <span></span>}
                                </BaseMenu>
                            </div>
                            {this.props.errorMessage ? 
                                <span id={id + '-error'} className="input-error">
                                    {this.props.errorMessage}
                                </span> : ''}
                        </div>
                    )}
                </Downshift>
            </div>
        );
    }
}

export default SWAutoComplete;
