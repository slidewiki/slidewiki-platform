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
                title: 'Message too short',
                html: 'The message you tried to send is too short. Please write more than 15 characters.',
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

    render() {
        let messages = [];
        for(let i in this.state.commentList) {
            messages.push(
              <Popup key={i}
                trigger={
                  <Message floating>
                    <Comment.Group>
                      <Comment>
                        <Comment.Content>
                          <Comment.Author>{this.state.commentList[i].peer.toString()}, {new Date(parseInt(i)).toLocaleTimeString('en-GB', { hour12: false, hour: 'numeric', minute: 'numeric'})}</Comment.Author>
                          <Comment.Text style={{wordWrap: 'break-word', whiteSpace: 'initial'}}>
                            {this.state.commentList[i].message}
                          </Comment.Text>
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
                <Grid.Column id="messageList" style={{'overflowY': 'auto', 'whiteSpace': 'nowrap', 'maxHeight': this.props.height*0.67+'px', 'minHeight': this.props.height*0.67+'px', 'height': this.props.height*0.67+'px'}}>
                  <div id="messageList"><h3>Questions from Audience:</h3>{messages}</div>
                </Grid.Column>
                <Grid.Column>
                  <Divider clearing />
                  <Button fluid={true} content='Clear Chat' labelPosition='right' icon='erase' primary onClick={this.clearMessageList.bind(this)}/>
                </Grid.Column>
              </Grid>
            ) : (
              <Grid columns={1}>
                <Grid.Column id="messageList" style={{'overflowY': 'auto', 'whiteSpace': 'nowrap', 'maxHeight': this.props.height*0.58+'px', 'minHeight': this.props.height*0.58+'px', 'height': this.props.height*0.58+'px'}}>
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
