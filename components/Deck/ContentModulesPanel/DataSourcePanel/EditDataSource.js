import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DataSourceStore from '../../../../stores/DataSourceStore';
import updateDataSources from '../../../../actions/datasource/updateDataSources';
import cancelEditDataSource from '../../../../actions/datasource/cancelEditDataSource';

class EditDataSource extends React.Component {
    componentDidMount() {

        $.fn.form.settings.rules.yearRule = (year) => {
            let currDate = new Date();
            let currYear = currDate.getFullYear();
            let intYear = parseInt(year);
            if (!intYear || intYear > currYear) {
                return false;
            }
            return true;
        };

        $.fn.form.settings.rules.urlRule = (url) => {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'http://' + url;
            }
            let expression = /https?:\/\/(www\.)?[-a-z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(\/[-a-z0-9@:%_\+.~#?&=]*)?/i;
            let regex = new RegExp(expression);

            if (url.match(regex)) {
                return true;
            } else {
                return false;
            }
        };

        const dataSourceValidation = {
            fields: {
                title: {
                    identifier: 'title',
                    rules: [{
                        type: 'empty',
                        prompt: 'This field cannot be empty.'
                    }]
                },
                url: {
                    identifier: 'url',
                    optional: true,
                    rules: [{
                        type: 'urlRule[url]',
                        prompt: 'The URL must be a valid one.'
                    }]
                },
                year: {
                    identifier: 'year',
                    optional: true,
                    rules: [{
                        type: 'yearRule[year]',
                        prompt: 'Enter a valid number for a Year, which is less or equal the current one.'
                    }]
                }
            },
            onSuccess: this.handleSave.bind(this)
        };
        $('.ui.form.edit')
            .form(dataSourceValidation);
    }

    handleCancelClick() {
        this.context.executeAction(cancelEditDataSource);
    }

    handleDeleteClick() {
        let dataSources = this.props.DataSourceStore.dataSources;
        const selectedIndex = this.props.DataSourceStore.selectedIndex;
        dataSources.splice(selectedIndex, 1);
        this.context.executeAction(updateDataSources, {
            dataSources: dataSources,
            sid: this.props.DataSourceStore.selector.sid
        });
    }

    handleSave(e) {
        e.preventDefault();
        let dataSource = this.props.dataSource;
        let dataSources = this.props.DataSourceStore.dataSources;

        if (dataSource === null) {
            let newDataSource = {
                type: this.refs.select_types.value,
                title: this.refs.title.value,
                url: this.refs.url.value,
                comment: this.refs.comment.value,
                authors: this.refs.authors.value,
                year: this.refs.year.value
            };
            dataSources.push(newDataSource);
        } else {
            dataSource.type = this.refs.select_types.value;
            dataSource.title = this.refs.title.value;
            dataSource.url = this.refs.url.value;
            dataSource.comment = this.refs.comment.value;
            dataSource.authors = this.refs.authors.value;
            dataSource.year = this.refs.year.value;
        }
        this.context.executeAction(updateDataSources, {
            dataSources: dataSources,
            sid: this.props.DataSourceStore.selector.sid
        });
        return false;
    }

    render() {
        let header = 'Edit source';
        let dataSource = this.props.dataSource;
        let deleteButton = (
            <button tabIndex="0" type="button" onClick={this.handleDeleteClick.bind(this)} className="ui red labeled icon button">
                <i className="icon minus circle"></i> Delete
            </button>
        );
        if (dataSource === null) {
            header = 'Add source';
            dataSource = {title: '', url: '', comment: ''};
            deleteButton = '';
        }
        let dataSourceTypeOptions = <select className="ui search dropdown" defaultValue={dataSource.type} aria-labelledby="type" id="type" ref="select_types">
            <option value="webpage" >Web page</option>publication
            <option value="webdocument" >Web document</option>
            <option value="publication" >Publication</option>
            <option value="person" >Person</option>
            <option value="plaintext" >Plain text</option>
        </select>;

        return (
            <div className="ui blue segment" >
                <h3 className="ui dividing header">{header}</h3>
                <form className="ui form edit">
                    <div className="ui seven wide required field" ref="div_types" >
                        <label htmlFor="type">Type</label>
                        {dataSourceTypeOptions}
                    </div>
                    <div className="ui required field">
                        <label htmlFor="title">Title</label>
                        <input type="text" ref="title" id="title" name="title" placeholder="Title" defaultValue={dataSource.title} autoFocus />
                    </div>
                    <div className="ui field">
                        <label htmlFor="url">URL</label>
                        <input type="text" ref="url" id="url" name="url" placeholder="Url" defaultValue={dataSource.url} />
                    </div>
                    <div className="ui field">
                        <label htmlFor="authors">Authors</label>
                        <input type="text" ref="authors" id="authors" name="authors" placeholder="Authors" defaultValue={dataSource.authors} />
                    </div>
                    <div className="ui field">
                        <label htmlFor="year">Year</label>
                        <input type="text" ref="year" id="year" name="year" placeholder="Year" defaultValue={dataSource.year} />
                    </div>
                    <div className="ui field">
                        <label htmlFor="comment">Comment</label>
                        <input type="text" ref="comment" id="comment" name="comment" placeholder="Comment" defaultValue={dataSource.comment} />
                    </div>

                    <div className="ui hidden divider"></div>
                    <button tabIndex="0" type="submit" className="ui blue labeled submit icon button" >
                        <i className="icon check"></i> Submit
                    </button>
                    <button tabIndex="0" type="button" onClick={this.handleCancelClick.bind(this)} className="ui secondary labeled icon button">
                        <i className="icon close"></i> Cancel
                    </button>
                    {deleteButton}
                    <div className="ui error message"/>
                </form>
            </div>
        );
    }
}

EditDataSource.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

EditDataSource = connectToStores(EditDataSource, [DataSourceStore], (context, props) => {
    return {
        DataSourceStore: context.getStore(DataSourceStore).getState()
    };
});

export default EditDataSource;
