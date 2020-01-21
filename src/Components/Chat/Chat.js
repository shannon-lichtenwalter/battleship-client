import React from 'react';
import './Chat.css'


export default class Chat extends React.Component {
    state = {
        messages: []
    }

    componentDidMount = () => {
        if(this.props.socket){
        this.props.socket.on('chat-message', data => {
            this.setState({
                messages: [...this.state.messages, {username: data.username, message: data.message}]
            })
            
        })
    }
    }

    handleChatMessage = (message) => {
        
        this.props.socket.emit('send-message', {room: this.props.room, message: message});
        this.setState({
            messages: [...this.state.messages, {username: 'Me', message}]
        })
    }

    render() {

        let chatHistory = this.state.messages.map((message, index) => {
            return(
                <li className='chat-li' key={index}>
                    <h4 className={message.username === 'Me' ? 'chat-username chat-me' : 'chat-username chat-opponent'}>{message.username}</h4>
                    <p className='chat-message' aria-live='polite'>{message.message}</p>
                </li>
            )
        })

        return (
            <div id='chat' aria-label='chat-box' aria-live='polite'>
                <ul id='chat-window'>
                    {chatHistory}
                </ul>
                <form id='chat-form' onSubmit={(event) => {
                    event.preventDefault();
                    this.handleChatMessage(event.target.chatInput.value);
                    event.target.chatInput.value = '';
                }}> <fieldset>
                        <legend>Chat with Opponent</legend>
                        <label htmlFor='chatInput' id='chat-label'>Type Message</label>
                        <input type='text' placeholder='Type Here' id='chatInput' aria-label='type message to opponent here' />
                    </fieldset>
                </form>
            </div>
        );
    }
}




// socketmessage in state

// clearSocketMessage=()=>{
//     this.setState({
//       socketMessage:''
//     })
//   }

//   socketMessage=(message)=>{
//     this.setState({
//       socketMessage:message
//     })
//   }

// socket.on('left', data =>{
//     this.setState({
//       socketMessage:data
//     })
//     setTimeout(()=>{
//       this.clearSocketMessage()}
//     , 3000)
//   })
//   roomName = this.state.room
//   console.log(roomName)
