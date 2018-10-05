import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";
import classNames from "classnames/bind";
import { NavLink } from "fluxible-router";
import Util from "../../common/Util";
import { DragSource } from "react-dnd";
import TreeNodeList from "./TreeNodeList";
import TreeNodeTarget from "./TreeNodeTarget";
import cheerio from "cheerio";
import AttachSubdeck from "../ContentPanel/AttachSubdeck/AttachSubdeckModal";
import AttachSlides from "../ContentPanel/AttachSubdeck/AttachSlidesModal";
import { connectToStores } from "fluxible-addons-react";
import ContentStore from "../../../stores/ContentStore";
import { Button, Popup, Icon } from "semantic-ui-react";
import { Microservices } from "../../../configs/microservices";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import addTreeNodeAndNavigate from '../../../actions/decktree/addTreeNodeAndNavigate';

import ContentActionsHeader from "../ContentPanel/ContentActions/ContentActionsHeader";

const findAllDescendants = node =>
    Immutable.Set.of(node).union(
        node.get("children")
            ? node.get("children").flatMap(findAllDescendants)
            : Immutable.List()
    );

const treeNodeSource = {
    beginDrag(props) {
        return {
            item: props.item,
            parentNode: props.parentNode,
            nodeIndex: props.nodeIndex,
            allDescendants: findAllDescendants(props.item)
        };
    },
    canDrag(props, monitor) {
        return props.parentNode.get("children").size > 1;
    }
};

class TreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mouseover: 0 };
    }

    //do not re-render in case of same props wihtout selector and if mode has not changed
    shouldComponentUpdate(nextProps, nextState) {
        return !(
            Immutable.is(nextProps.item, this.props.item) &&
            nextProps === this.props.mode
        );
    }

    // Explicitly focus the node link in view mode
    focusNode() {
        ReactDOM.findDOMNode(this.nodeLink).focus();
    }

    componentDidUpdate(prevProps, prevState) {
        //check if node was focused
        if (this.props.item.get("focused") && !prevProps.item.get("focused"))
            this.focusNode();
    }

    handleExpandIconClick(selector, e) {
        this.props.onToggleNode(selector);
        e.stopPropagation();
    }

    handleAddClick(selector, nodeSpec, e) {
        this.props.onAddNode(selector, nodeSpec);
        e.stopPropagation();
    }

    handleMouseOver(e) {
        this.setState({ mouseover: 1 });
        e.stopPropagation();
    }

    handleMouseOut(e) {
        this.setState({ mouseover: 0 });
        e.stopPropagation();
    }

    handleDeleteClick(selector, e) {
        this.props.onDeleteNode(selector);
        e.stopPropagation();
    }

    handleRenameClick(selector, e) {
        //only if user is logged in and has the rights
        if (
            this.props.username !== "" &&
            this.props.permissions.edit &&
            !this.props.permissions.readOnly
        ) {
            this.props.onRename(selector);
            e.stopPropagation();
        }
    }

    handleUndoRenameClick(selector, e) {
        this.props.onDoRename(selector);
        e.stopPropagation();
    }

    handleMenuClick(selector, e) {
        this.props.onSwitchOnAction(selector);
        e.stopPropagation();
    }

    handleEditFocus(e) {
        e.target.select();
    }

    handleFocus(e) {
        $(e.target)
            .find("div.card:first")
            .css("border", "2px solid #1e78bb");
    }

    handleBlur(e) {
        let target = $(e.target).find("div.card:first");
        if (target.attr("data-selected") === "false") target.css("border", "");
        else target.css("border", "2px solid black");
    }

    handleNameChange(e) { }

    handleKeyDown(selector, e) {
        switch (e.keyCode) {
            //case 9: // Tab
            case 13: // Enter
                if (e.target.value.trim()) {
                    this.props.onSave(
                        selector,
                        this.props.item.get("title"),
                        e.target.value.trim()
                    );
                }
                break;
            case 27: // escape
                this.props.onUndoRename(selector);
                break;
        }
    }

    render() {
        let self = this;
        const { isDragging, connectDragSource, nodeIndex } = this.props;
        //adapt URLs based on the current page
        let nodeSelector = {
            id: this.props.rootNode.id,
            stype: this.props.item.get("type"),
            sid: this.props.item.get("id"),
            spath: this.props.item.get("path")
        };
        let canEdit =
            !this.props.permissions.readOnly &&
            this.props.permissions.edit &&
            this.props.ContentStore.mode !== "edit" &&
            !this.props.showThumbnails;
        let nodeURL = Util.makeNodeURL(
            nodeSelector,
            this.props.page,
            "view",
            this.props.rootNode.slug,
            undefined,
            true
        );
        let childNodesDIV = "";
        let actionSigClass;
        let actionBtnsClass;
        let iconClassImageMode = classNames({
            "ui icon": true,
            large: true,
            "yellow folder link": true,
            open: this.props.item.get("expanded")
        });
        let iconClassTextMode = classNames({
            "ui icon": true,
            "grey file text": this.props.item.get("type") === "slide",
            "yellow folder link": this.props.item.get("type") === "deck",
            open: this.props.item.get("expanded")
        });
        let imgClass = {
            border: this.props.item.get("selected")
                ? "2px solid black"
                : "2px solid lightgrey"
        };
        let content = "";
        let nodeTitle = "";
        let divToInsert = "";

        if (this.props.item.get("type") === "deck")
            childNodesDIV = (
                <TreeNodeList
                    parentNode={self.props.item}
                    onToggleNode={self.props.onToggleNode}
                    onSwitchOnAction={self.props.onSwitchOnAction}
                    onRename={self.props.onRename}
                    onUndoRename={self.props.onUndoRename}
                    onSave={self.props.onSave}
                    onAddNode={self.props.onAddNode}
                    onDeleteNode={self.props.onDeleteNode}
                    onMoveNode={self.props.onMoveNode}
                    mode={self.props.mode}
                    page={self.props.page}
                    rootNode={self.props.rootNode}
                    username={self.props.username}
                    permissions={self.props.permissions}
                    showThumbnails={this.props.showThumbnails}
                />
            );

        if (
            this.props.item.get("type") === "slide" &&
            this.props.showThumbnails
        ) {
            content = (
                <div
                    className="ui fluid card"
                    data-selected={this.props.item.get("selected")}
                    style={imgClass}
                >
                    <img
                        src={
                            Microservices.file.uri +
                            "/thumbnail/slide/" +
                            this.props.item.get("id") +
                            "/" +
                            (this.props.item.get("theme")
                                ? this.props.item.get("theme")
                                : "default")
                        }
                        alt={this.props.item.get("title")}
                        width="100%"
                    />
                </div>
            );
        } else {
            content = cheerio.load(this.props.item.get("title")).text();
            nodeTitle = content;
        }
        if (this.props.item.get("selected") && !this.props.showThumbnails)
            content = <strong> {nodeTitle} </strong>;
        if (this.props.item.get("editable")) {
            divToInsert = (
                <input
                    autoFocus
                    onFocus={this.handleEditFocus}
                    type="text"
                    defaultValue={nodeTitle}
                    onChange={this.handleNameChange}
                    onKeyDown={this.handleKeyDown.bind(this, nodeSelector)}
                />
            );
        } else {
            if (!this.props.showThumbnails) {
                divToInsert = (
                    <div>
                        <i
                            onClick={this.handleExpandIconClick.bind(
                                this,
                                nodeSelector
                            )}
                            className={iconClassTextMode}
                            aria-hidden="true"
                        >
                            {" "}
                        </i>
                        <NavLink
                            href={nodeURL}
                            tabIndex={this.props.item.get("focused") ? 0 : -1}
                            ref={el => {
                                this.nodeLink = el;
                            }}
                            onDoubleClick={this.handleRenameClick.bind(
                                this,
                                nodeSelector
                            )}
                        >
                            {content}
                        </NavLink>
                    </div>
                );
            } else {
                divToInsert = (
                    <div onFocus={this.handleFocus} onBlur={this.handleBlur}>
                        {this.props.item.get("type") === "deck" &&
                            this.props.showThumbnails ? (
                                <i
                                    onClick={this.handleExpandIconClick.bind(
                                        this,
                                        nodeSelector
                                    )}
                                    className={iconClassImageMode}
                                    aria-hidden="true"
                                >
                                    {" "}
                                </i>
                            ) : (
                                ""
                            )}

                        <NavLink
                            href={nodeURL}
                            tabIndex={this.props.item.get("focused") ? 0 : -1}
                            ref={el => {
                                this.nodeLink = el;
                            }}
                        >
                            {content}
                        </NavLink>
                        {this.props.item.get("type") === "deck" &&
                            this.props.showThumbnails ? (
                                <div className="ui fitted divider" />
                            ) : (
                                ""
                            )}
                    </div>
                );
            }
        }
        let compStyle = {
            outline: "none",
            opacity: isDragging ? "0.4" : "1",
            position: "relative"
        };


        let random = Math.random() * (5555 - 1);
        const context_id = "asfwq3" + random;

        return connectDragSource(
            <div>

                <ContextMenuTrigger id={context_id} holdToDisplay={-2000}>
                    <div className="item" style={compStyle}>
                        {nodeIndex === 0 ? (
                            <TreeNodeTarget
                                parentNode={self.props.parentNode}
                                nodeIndex={nodeIndex}
                                onMoveNode={self.props.onMoveNode}
                                isAfterNode={false}
                            />
                        ) : null}
                        <div
                            onMouseOver={this.handleMouseOver.bind(this)}
                            onMouseOut={this.handleMouseOut.bind(this)}
                        >
                            {divToInsert}
                        </div>
                        {childNodesDIV}
                        <TreeNodeTarget
                            parentNode={self.props.parentNode}
                            onMoveNode={self.props.onMoveNode}
                            nodeIndex={nodeIndex + 1}
                            isAfterNode={true}
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenu id={context_id}>
                    <MenuItem data={{ props: this.props }} onClick={this.handleOnAddSlideClick}>
                        Add Slide
                    </MenuItem>
                    <MenuItem data={{ props: this.props }} onClick={this.handleClick}>
                        Add Deck
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem data={{ props: this.props }} onClick={this.handleClick}>
                        Attach Slide
                    </MenuItem>
                    <MenuItem data={{ props: this.props }} onClick={this.handleClick}>
                        Attach Deck
                    </MenuItem>
                </ContextMenu>
            </div>
        );
    }

    handleOnAddSlideClick(e, data) {
        console.log("handleOnAddSlideClick");
        console.log(data.props.item);
        let selector = {
            id: data.props.rootNode.id,
            stype: data.props.item.get("type"),
            sid: data.props.item.get("id"),
            spath: data.props.item.get("path")
        };
        data.props.onAddNode(selector, { type: "slide", id: "0" });
        //context.executeAction(addTreeNodeAndNavigate, selector, { type: "slide", id: selector.id });
        e.stopPropagation();
    }

    handleClick(e, data) {
        console.log("handleClick");
        console.log(data.selector);
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object {type: "slide", id: "0"}
        //ContentActionsHeader.onAddNode(data.selector, data.nodeSpec);
        console.log(context);
    }
}

TreeNode = connectToStores(TreeNode, [ContentStore], (context, props) => {
    return {
        ContentStore: context.getStore(ContentStore).getState()
    };
});

let TreeNodeWrapped = DragSource(
    "tree-node",
    treeNodeSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)(TreeNode);

export default TreeNodeWrapped;
