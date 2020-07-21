import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import suggestTags from '../../../../actions/search/suggestTags';
import { defineMessages } from 'react-intl';
import { Form, Dropdown } from 'semantic-ui-react';
import { uniq } from 'lodash';

class TagInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [],
            optionsCache: [],
        };
    }
  
    handleTagsSearchChange = (e, dropdown) => {
        const { searchQuery } = dropdown;
        let query = Object.assign({ q: searchQuery }, this.props.tagFilter);
        context.executeAction(suggestTags, { query }).then((response) => {
            let options = response.results;

            // prepend 'existing:' to the tag names
            for (let option in options) {
                options[option] = {
                    ...options[option],
                    tagName: 'existing:' + options[option].tagName,
                };
            }

            this.setState((prevState) => ({
                options: options,
            }));
        });
    };

    onChange = (e, dropdown) => {
        // optionsCache needs an array of selected options to ensure values are correctly displayed
        let optionsCache = [];
        for (const option of this.state.options) {
            if (dropdown.value.includes('existing:' + option.tagName) || dropdown.value.includes(option.tagName)) {
                optionsCache.push(option);
            }
        }

        this.setState({
            optionsCache,
        });

        this.props.onChange(e, dropdown);
    };

    handleAddItem = (e, dropdown) => {
        this.setState((prevState) => ({
            optionsCache: [
                ...prevState.optionsCache,
                {
                    tagName: dropdown.value,
                    defaultName: dropdown.value,
                },
            ],
        }));
        return false;
    };

    render() {
        let options = this.state.options;

        for (const option of this.state.optionsCache) {
            if (this.props.value.includes('existing:' + option.tagName) || this.props.value.includes(option.tagName)) {
                options.push(option);
            }
        }

        if (this.props.initialOptions && this.props.initialOptions.length) {
            options.push(...this.props.initialOptions);
        }

        options = uniq(options, 'tagName');
        console.log('options', options);
        console.log('value', this.props.value);
        return (
            <Form.Field
                allowAdditions={this.props.allowAdditions}
                id={this.props.id}
                control={Dropdown}
                label={this.props.label}
                selection
                search
                multiple
                value={this.props.value}
                onChange={this.onChange}
                options={options.map((option) => ({
                    value: option.tagName,
                    text: option.defaultName,
                }))}
                onSearchChange={this.handleTagsSearchChange}
                onAddItem={this.handleAddItem}
                placeholder={this.props.placeholder}
            />
        );
    }
}

TagInput.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
};

export default TagInput;