import React from 'react';
import classNames from 'classnames';

/**
 * Properties:
 *   required: true|false
 *   ?country:  template short code, like en_EN or de_AT
 *   type: spoken/ui defines which templates are available
 *   tooltip
 */

class TemplateDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.show = false;
    }
    componentDidMount() {
        $(this.refs.TemplateDropdown).dropdown();
    }

    componentDidUpdate() {
        $(this.refs.TemplateDropdown).dropdown();
    }

    getSelected() {
        if (this.show === true)
        {return this.refs.template.value;}
    }
    showOptions() {
        this.show = true;
        this.forceUpdate();
        return false;
    }
    render() {
        let classes = classNames({
            'ui': true,
            'field': true,
            'search': true,
            'selection': true,
            'dropdown': true
        });

        let templateOptions = <div className="menu">
            <div className="item" data-value="title">
                Title Page
            </div>
            <div className="item" data-value="1" >
                Title and bullets
            </div>
            <div className="item" data-value="2" >
                Empty document
            </div>
            <div className="item" data-value="11" >
                1 row 1 column
            </div>
            <div className="item" data-value="12" >
                1 row 2 columns
            </div>
            <div className="item" data-value="22" >
                2 rows 2 columns
            </div>
            <div className="item" data-value="21" >
                2 rows 1 column
            </div>
            <div className="item" data-value="11img" >
                1 row 1 column image
            </div>
            <div className="item" data-value="3" >
                Document with title
            </div>
        </div>;

        //let tooltip = this.props.tooltip;
        //if (tooltip === undefined || tooltip === null)
        //    tooltip = 'There will be more in the future';

        if(this.show === true)
        {
            return (
                <div className={classes} data-position="top center" data-inverted="" ref="TemplateDropdown">
                    <input type="hidden" name="template" id="template" ref="template" defaultValue={this.props.template} />
                    <i className="dropdown icon"/>
                    <div className="default text">Select your template</div>
                    {templateOptions}
                </div>
            );
        }
        else {
            return(false);
        }
    }
}

TemplateDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default TemplateDropdown;
