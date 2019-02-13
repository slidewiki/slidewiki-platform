import React from 'react';
import {
    Wrapper,
    Button,
    Menu,
    MenuItem,
    openMenu,
    closeMenu
} from 'react-aria-menubutton';
import AriaMenuButton from 'react-aria-menubutton';
import {getLanguageName} from '../../common';
import {Icon} from 'semantic-ui-react';

class SWDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: this.props.options.find((option) => (option.value === this.props.value)) || null,
            value: this.props.value || null
        };
    }

    handleSelection(item) {
        this.setState({ selectedItem: item, value: item.value });
    }

    render() {
        const fancyMenuItems = this.props.options.map((option, i) => (
            <MenuItem
                value={option}
                key={option.key}
                tag='li'
                className="item"
            >{option.text}</MenuItem>
        ));

        const menuInnards = (menuState) => {
            if (!menuState.isOpen) return null;
            return (
                <div className="FancyMB-menu" key="menu">
                    {fancyMenuItems}
                </div>
            );
        };

        return (
            <div>
                <Wrapper
                    onSelection={this.handleSelection.bind(this)}
                >
                    <Button className="ui fluid selection dropdown">
                        {this.state.selectedItem ? this.state.selectedItem.text : null }
                        <Icon name='dropdown'/>
                    </Button>
                    <Menu className='ui menu vertical'
                        style={{'position':'absolute', 'zIndex':'3', 'right':'0px', 'display': 'flex !important', 'marginTop': '0'}}>{menuInnards}</Menu>
                </Wrapper>
            </div>
        );
    }
}

export default SWDropdown;
