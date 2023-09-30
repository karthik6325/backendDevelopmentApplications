import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './chat.css'

let socket;
const Chat = () => {
    const [user, setUser] = useState("");
    const [room, setRoom] = useState("");
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socketUrl = 'http://localhost:8000'

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const user = params.get('name');
        const room = params.get('room');

        setUser(user)
        setRoom(room)

        socket = io(socketUrl);



        socket.emit('join', { user, room }, (err) => {
            if (err) {
                alert(err)
            }
        })

        return () => {
            //User leaves room
            socket.disconnect();

            socket.off()
        }

    }, [socketUrl, window.location.search])

    useEffect(() => {
        socket.on('message', msg => {
            setMessages(prevMsg => [...prevMsg, msg])

            setTimeout(() => {

                var div = document.getElementById("chat_body");
                div.scrollTop = div.scrollHeight - div.clientWidth;
            }, 10)
        })

        socket.on('roomMembers', usrs => {
            setUsers(usrs)
        })
    }, [])

    const sendMessage = (e) => {
        e.preventDefault();

        socket.emit('sendMessage', message, () => setMessage(""))
        setTimeout(() => {
            var div = document.getElementById("chat_body");
            div.scrollTop = div.scrollHeight;
        }, 100)
    }

    return (
        <div className="contain">
            <div className="container mt-4 ">
                <div className="row chat-window">
                    <div className="leftInnerContainer">
                        <h2 className="head">Active Users</h2>
                        <ul>
                            {
                                users.map((e, i) => (
                                    <li className="list" key={i}>{e.user}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="col-xs-8 col-md-8">
                        <div className="panel">
                            <div className="panel-heading">
                                    Room name : {room}
                            </div>
                            <div className="panel-body msg_container_base" id="chat_body">
                                {
                                    messages.map((e, i) => (
                                        e.user === user?.toLowerCase() ? <>
                                            <div key={i} className="row msg_container base_receive">
                                                <div >
                                                    <div className="messages msg_receive">
                                                        <p>{e.text}</p>
                                                        <time>{e.user}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </> : <>
                                            <div key={i} className="row msg_container base_sent">
                                                <div >
                                                    <div className="messages msg_sent">
                                                        <p>{e.text}</p>
                                                        <time>{e.user}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))
                                }

                            </div>
                            <form className="form">
                                    <input className="input" id="btn-input" type="text"
                                        value={message}
                                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                                        onChange={(event) => setMessage(event.target.value)}
                                        placeholder="Write your message here..." />
                                    <button className="sendButton" onClick={event => sendMessage(event)}>Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;