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
    lastMessage - var
*/

    constructor(props) {
        super(props);

        this.textInputLength = 300;
        this.commentList = {};//{timestamp: {peer: username, message: text},timestamp: {peer: username, message: text}}
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lastMessage.data) {
            let currentMessage = this.props.lastMessage;
            if (currentMessage === {} || currentMessage === undefined)
                currentMessage = {
                    peerID: 0,
                    data: {
                        sender: 0,
                        data: null
                    }
                };
            if (nextProps.lastMessage.peerID !== currentMessage.peerID
              || nextProps.lastMessage.data.sender !== currentMessage.data.sender
              || nextProps.lastMessage.data.data !== currentMessage.data.data) {
                this.addMessage(nextProps.lastMessage.data, false, nextProps.lastMessage.peerID);
            }
        }
    }

    updateCharCount(){
        $('#textCharCount').text($('#messageToSend').val().length + '/' + this.textInputLength);
    }

    sendMessage(event) {
        event.preventDefault();
        if($('#messageToSend:first').val().length < 15){
            swal({
                title: 'Message too short',
                html: 'The message you tried to send is too short. Please write more than 15 characters.',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false
            });
        } else {
            this.props.sendRTCMessage('message', $('#messageToSend:first').val(), this.props.presenterID);
            this.addMessage({sender: this.props.myID, data: $('#messageToSend:first').val()}, true);
            $('#messageToSend:first').val('');
            this.updateCharCount();
        }
        return false;
    }

    addMessage(data, fromMyself = false, peerID = null) {
        let currentTime = new Date().getTime();
        this.commentList[currentTime] = {};
        if(!fromMyself)
            this.commentList[currentTime].peer = this.props.pcs[peerID].username || Object.keys(this.props.pcs).indexOf(data.sender);
        else
            this.commentList[currentTime].peer = 'Me';
        this.commentList[currentTime].message = data.data;
        this.forceUpdate();
    }

    render() {
        let messages = [];
        for(let i in this.commentList) {
            messages.push(
              <Popup key={i}
                trigger={
                  <Message floating>
                    <Comment.Group>
                      <Comment>
                        <Comment.Content>
                          <Comment.Author>{this.commentList[i].peer.toString()}, {new Date(parseInt(i)).toLocaleTimeString('en-GB', { hour12: false, hour: 'numeric', minute: 'numeric'})}</Comment.Author>
                          <Comment.Text style={{wordWrap: 'break-word', whiteSpace: 'initial'}}>
                            {this.commentList[i].message}
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
            {(!this.props.isInitiator) ? (
              <Grid columns={1}>
                <Grid.Column id="messageList" style={{'overflowY': 'auto', 'whiteSpace': 'nowrap', 'maxHeight': this.props.height*0.5+'px', 'minHeight': this.props.height*0.5+'px', 'height': this.props.height*0.5+'px'}}>
                  <h3>Your Questions:</h3>
                  {messages}
                </Grid.Column>
                <Grid.Column>
                  <Divider clearing />
                  <Form reply>
                    <div>
                      <Form.TextArea id="messageToSend" placeholder='Ask a question...' maxLength={this.textInputLength} onChange={this.updateCharCount.bind(this)}/>
                      <Form.Field>
                        <Button content='Send Question' labelPosition='right' icon='send' primary onClick={this.sendMessage.bind(this)}/>
                        <Label pointing='left' id='textCharCount'>0/{this.textInputLength}</Label>
                      </Form.Field>
                    </div>
                  </Form>
                </Grid.Column>
              </Grid>
            ) : (
              <div id="messageList"><h3>Questions from Audience:</h3>{messages}</div>
            )}
          </div>
        );
    }
}

Chat.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Chat;
