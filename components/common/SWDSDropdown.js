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

/**
 * Renders an accessible dropdown component, using the Downshift library.
 */
class SWDSDropdown extends React.Component {

    initialItem = null;

    constructor(props){
        super(props);

        this.state = {
            value: props.defaultValue
        };

        if(props.defaultValue) {
            this.initialItem = this.props.options.find((i) => i.value === this.props.defaultValue);
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
        })),
        /** A placeholder that should be rendered in the Component. */
        placeholder: PropTypes.string,
        /** Whether the element is in an error state. */
        error: PropTypes.bool,
        /** The pre-set value of the Component. */
        defaultValue: PropTypes.string,
        /** The width in columns of the Component. */
        width: PropTypes.string,
        // TODO: Add label
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
        if(selectedItem) this.setState({value: selectedItem.value});
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

        return (
            <div className={wrapperClasses}>
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
                                {/*<div*/}
                                    {/*{...getInputProps({*/}
                                        {/*placeholder: this.props.placeholder,*/}
                                        {/*autoComplete: 'nope'*/}
                                    {/*})}*/}
                                    {/*className="text" role="alert">{this.state.selectedItem ? this.state.selectedItem.text : null} {selectedItem ? selectedItem.text : null}</div>*/}
                                <Input
                                    {...getInputProps({
                                        isOpen,
                                        placeholder: this.props.placeholder,
                                        autoComplete: 'nope'
                                    })}
                                />
                                <ControllerButton {...getToggleButtonProps()} {...css({zIndex: 12})}>
                                    <ArrowIcon isOpen={isOpen} />
                                </ControllerButton>
                            </div>
                            <div {...css({position: 'relative', zIndex: 9})}>
                                <BaseMenu {...getMenuProps({isOpen})}>
                                    {isOpen ?
                                        filterItems(inputValue, this.props.options).map((item, index) => (
                                            <Item
                                                key={item.key}
                                                {...getItemProps({
                                                    item,
                                                    index,
                                                    isActive: highlightedIndex === index,
                                                    isSelected: selectedItem === item,
                                                })}
                                            >
                                                {item.icon}
                                                {itemToString(item)}
                                            </Item>
                                        )) : null}
                                </BaseMenu>
                            </div>
                        </div>
                    )}
                </Downshift>
            </div>
        );
    }
}

export default SWDSDropdown;
