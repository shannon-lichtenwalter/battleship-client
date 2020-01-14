import React from 'react';
import './Chat.css'


export default class Chat extends React.Component {
    state = {
        messages: [{username:'schmittywormenjagermanjensen', message:'hello'}, {username:'Me', message:'Hi yourself schmittywormenjagermanjensenschmittywormenjagermanjensenschmittywormenjagermanjensenschmittywormenjagermanjensenschmittywormenjagermanjensenschmittywormenjagermanjensenschmittywormenjagermanjensenschmittywormenjagermanjensenschmittywormenjagermanjensenschmittywormenjagermanjensen'}, {username:'schmittywormenjagermanjensen', message:'glhf'}]
    }

    componentDidMount = () => {
        this.props.socket.on('chat-message', data => {

            this.setState({
                messages: [...this.state.messages, {username: data.username, message: data.message}]
            })
            
        })
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
                    <p className='chat-message'>{message.message}</p>
                </li>
            )
        })




        return (
            <div id='chat'>
                <ul id='chat-window'>
                    {chatHistory}
                </ul>
                <form id='chat-form' onSubmit={(event) => {
                    event.preventDefault();
                    this.handleChatMessage(event.target.chatInput.value);
                    event.target.chatInput.value = '';
                }}>
                    <label htmlFor='chatInput'>Chat Input</label>
                    <input type='text' placeholder='Type your message here.' id='chatInput' />
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