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

/**
 * Renders an accessible dropdown component, using the Downshift library.
 */
class SWDSDropdown extends React.Component {

    initialItem = null;

    constructor(props){
        super(props);

        // this.state = {
        //     selectedItem: null
        // };

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
            name: PropTypes.node,
            value: PropTypes.string,
        })),
        /** A placeholder that should be rendered in the <input>. */
        placeholder: PropTypes.string,
        /** Whether the element is in an error state. */
        error: PropTypes.bool,
        /** The pre-set value of the <input>. */
        value: PropTypes.string,
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
        // console.log(selectedItem);
        // this.state.selectedItem = selectedItem;
        if(this.props.onChange) this.props.onChange({
            target: {
                text: this.props.text,
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
                                        // disabled: true,
                                        placeholder: this.props.placeholder,
                                        autoComplete: 'nope'
                                    })}
                                />
                                <ControllerButton {...getToggleButtonProps()}>
                                    <ArrowIcon isOpen={isOpen} />
                                </ControllerButton>
                            </div>
                            <div {...css({position: 'relative', zIndex: 9})}>
                                <BaseMenu {...getMenuProps({isOpen})}>
                                    {isOpen ?
                                        this.props.options.map((item, index) => (
                                            <Item
                                                key={item.key}
                                                {...getItemProps({
                                                    item,
                                                    index,
                                                    isActive: highlightedIndex === index,
                                                    isSelected: selectedItem === item,
                                                })}
                                            >
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
