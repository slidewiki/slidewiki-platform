import React from 'react';
import {translationLanguages, getLanguageDisplayName} from '../../common';
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
} from '../../lib/swAutoCompleteShared';
import Downshift from 'downshift';
import PropTypes from 'prop-types';

class SWAutoComplete extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    static propTypes = {
        /** Whether the AutoComplete input is required. */
        required: PropTypes.bool,
    };

    getValue() {
        return this.state.value;
    }

    render() {
        return (
            <Downshift
                onChange={(selection) => {
                    console.log(
                        selection
                            ? `You selected ${itemToString(selection)}`
                            : 'selection cleared',
                    );
                    this.setState({value: selection});
                    this.props.value = selection;
                }
                }
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
                    <div
                    //    {...css({width: 250, margin: 'auto'})}
                    >
                        <Label {...getLabelProps()}>{this.props.label}</Label>
                        <div {...css({position: 'relative'})}>
                            <Input
                                {...getInputProps({
                                    isOpen,
                                    placeholder: '',
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
                        <div {...css({position: 'relative'})}>
                            <BaseMenu {...getMenuProps({isOpen})}>
                                {isOpen
                                    ? getItems(inputValue).map((item, index) => (
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

// LanguageDropdown.contextTypes = {
//     executeAction: PropTypes.func.isRequired,
//     intl: PropTypes.object.isRequired
// };

export default SWAutoComplete;
