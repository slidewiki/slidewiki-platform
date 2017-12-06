import React from 'react';
import { Grid, Divider, Form, Button, Label, Popup, Message, Comment } from 'semantic-ui-react';

class Chat extends React.Component {

/*
  Props:
    isInitiator - var
    height - var
    sendRTCMessage - func
    presenterID - var
    myID - var
    pcs - var
*/

    constructor(props) {
        super(props);

        this.state = {
            commentList: {},//{timestamp: {peer: username, message: text},timestamp: {peer: username, message: text}}
            charCount: 0,
            TextAreaContent: ''
        };
        this.textInputLength = 2000;
    }

    updateCharCount(e, {name, value}){
        this.setState({charCount: value.length, [name]: value});
    }

    sendMessage(event) {
        event.preventDefault();
        if(this.state.TextAreaContent.length < 15){
            swal({
                titleText: 'Message too short',
                text: 'The message you tried to send is too short. Please write more than 15 characters.',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false
            });
        } else {
            this.props.sendRTCMessage('message', this.state.TextAreaContent, this.props.presenterID);
            this.addMessage({sender: this.props.myID, data: this.state.TextAreaContent}, true);
            this.setState({charCount: 0, TextAreaContent: ''});
        }
        return false;
    }

    addMessage(data, fromMyself = false, peerID = null) {
        let currentTime = new Date().getTime();
        let newPost = {};
        newPost[currentTime] = {};
        if(!fromMyself)
            newPost[currentTime].peer = this.props.pcs[peerID].username || Object.keys(this.props.pcs).indexOf(data.sender);
        else
            newPost[currentTime].peer = 'Me';
        newPost[currentTime].message = data.data;
        this.setState((prevState) => {
            return {commentList: Object.assign({}, prevState.commentList, newPost)};
        });
    }

    clearMessageList() {
        this.setState({commentList: {}});
    }

    openMessageInModal(peer, message) {
        swal({
            titleText: 'Message from ' + peer,
            html: '<div style="word-wrap:break-word; white-space:pre-wrap; text-align:left;padding:5%;">' + escapeHTML(message) + '</div>',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Close',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        function  escapeHTML(text) {
            return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }
    }

    render() {
        let messages = [];
        for(let i in this.state.commentList) {
            let author = this.state.commentList[i].peer.toString();
            let message = this.state.commentList[i].message;
            messages.push(
                <Popup key={i}
                    trigger={
                        <Message floating>
                            <Comment.Group>
                                <Comment>
                                    <Comment.Content>
                                        <Comment.Author>{author}, {new Date(parseInt(i)).toLocaleTimeString('en-GB', { hour12: false, hour: 'numeric', minute: 'numeric'})}</Comment.Author>
                                        <Comment.Text style={{wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}>
                                            {message}
                                        </Comment.Text>
                                        {(this.props.isInitiator) ? (
                                            <Comment.Actions>
                                                <Comment.Action onClick={this.openMessageInModal.bind(this, author, message)}>Enlarge</Comment.Action>
                                            </Comment.Actions>
                                        ) : ('')}
                                    </Comment.Content>
                                </Comment>
                            </Comment.Group>
                        </Message>
                    }
                    content={this.props.isInitiator ? 'Answer this questions by speaking to your audience' : 'The presenter has recieved your message and may answer via voice'}
                    position='bottom right'
                />);
        }

        return (
            <div>
                {(this.props.isInitiator) ? (
                    <Grid columns={1}>
                        <Grid.Column style={{'overflowY': 'auto', 'whiteSpace': 'nowrap', 'maxHeight': this.props.height*0.67+'px', 'minHeight': this.props.height*0.67+'px', 'height': this.props.height*0.67+'px'}}>
                            <h3>Questions from Audience:</h3>
                            {messages}
                        </Grid.Column>
                        <Grid.Column>
                            <Divider clearing />
                            <Button fluid={true} content='Clear Chat' labelPosition='right' icon='erase' primary onClick={this.clearMessageList.bind(this)}/>
                        </Grid.Column>
                    </Grid>
                ) : (
                    <Grid columns={1}>
                        <Grid.Column style={{'overflowY': 'auto', 'whiteSpace': 'nowrap', 'maxHeight': this.props.height*0.58+'px', 'minHeight': this.props.height*0.58+'px', 'height': this.props.height*0.58+'px'}}>
                            <h3>Your Questions ({this.props.myName}):</h3>
                            {messages}
                        </Grid.Column>
                        <Grid.Column>
                            <Divider clearing />
                            <Form reply>
                                <div>
                                    <Form.TextArea id="messageToSend" placeholder='Ask a question...' maxLength={this.textInputLength} name="TextAreaContent" value={this.state.TextAreaContent} onChange={this.updateCharCount.bind(this)}/>
                                    <Form.Field>
                                        <Button content='Send Question' labelPosition='right' icon='send' primary onClick={this.sendMessage.bind(this)}/>
                                        <Label pointing='left'>{this.state.charCount}/{this.textInputLength}</Label>
                                    </Form.Field>
                                </div>
                            </Form>
                        </Grid.Column>
                    </Grid>
                )}
            </div>
        );
    }
}

Chat.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Chat;
