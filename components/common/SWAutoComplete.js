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

/**
 * Renders an accessible autocomplete component, using the Downshift library.
 */
class SWAutoComplete extends React.Component {
    constructor(props){
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    static propTypes = {
        /** Whether the AutoComplete input is required. */
        required: PropTypes.bool,
        /** Dropdown selection items. Must be an array of objects, each with 'id' and 'value' attributes. */
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.node,
            name: PropTypes.string
        })),
        placeholder: PropTypes.string
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
        this.props.onChange({
            target: {
                name: this.props.name,
                value: (selectedItem ? selectedItem.id : null)
            }
        });
    }

    render() {
        return (
            <Downshift
                onChange={this.handleOnChange}
                itemToString={itemToString}
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
                                })}
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
                                    ? filterItems(inputValue, this.props.items).map((item, index) => (
                                        <Item
                                            key={item.id}
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
        );
    }
}

export default SWAutoComplete;
