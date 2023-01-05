import './MainPageArea.scss'
import {Message} from "../Message";
import {displayMsgTimeInPrettyWay} from "../../utils/displayMsgTimeInPrettyWay";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {useEffect, useState} from "react";
import {SingleChat} from "../SingleChat";
import {LogoutButton} from "../LogoutButton";


export function MainPageArea(props) {
    const [messagesCommonChat, setMessagesCommonChat] = useState(null)
    const [chatsApi, setChatsApi] = useState(null)

    useEffect(() => {
        const getCommonMessagesTimer =
            setInterval(() => {
                fetch(`https://tt-front.vercel.app/messages/`)
                    .then(res => res.json())
                    .then(data => setMessagesCommonChat(data));
            }, 1000)
        return () => clearInterval(getCommonMessagesTimer);
    }, []);

    useEffect(() => {
        fetch(`http://127.0.0.1:9000/chat/get_all_chats/`)
            .then(res => res.json())
            .then(data => {
                setChatsApi(data["items"])
            });
    }, [])

    if (props.areaType === "pageChat") {
        return (
            <div className="chat-area">
                {
                    props.chatName === "Общий чат" ?
                        messagesCommonChat ? messagesCommonChat.map((msg, key) => (
                            <Message
                                key={key}
                                msgAuthor={msg.author}
                                msgText={msg.text}
                                msgTime={displayMsgTimeInPrettyWay(msg.timestamp)}
                                msgType={"message-companion"}
                                iconType={"done"}></Message>)).reverse() : null : null
                }
                {
                    props.msgs ? props.msgs.map((msg, key) => (
                        <Message
                            key={key}
                            msgAuthor={msg.author}
                            msgText={msg.content}
                            msgTime={displayMsgTimeInPrettyWay(msg.dispatch_date)}
                            msgType={"message-companion"}
                            iconType={"done"}></Message>)).reverse() : null
                }
            </div>
        )
    } else if (props.areaType === "pageChatList") {

        return (
            <div className={"list-chats"}>
                {
                    messagesCommonChat ? (
                            <div className={"single-chat-container"} id={"common-chat"}
                                 onClick={(event) => props.handleClick(event, "Общий чат")}>
                                <SingleChat
                                    handleClickAccountCircleIcon={props.handleClickAccountCircleIcon}
                                    chatName={"Общий чат"}
                                    countChatUsers={10}
                                    page={props.areaType}
                                    msgText={messagesCommonChat.at(-1).text}
                                    msgAuthor={messagesCommonChat.at(-1).author}
                                    msgTime={displayMsgTimeInPrettyWay(messagesCommonChat.at(-1).timestamp)}>
                                </SingleChat>
                            < /div>)
                        : null
                }
                {
                    chatsApi ? chatsApi.map((chat) => (
                        <div className={"single-chat-container"} id={chat.id}
                             onClick={(event) => props.handleClick(event, chat.id)}
                             key={chat.id}
                        >
                            <SingleChat
                                handleClickAccountCircleIcon={props.handleClickAccountCircleIcon}
                                countChatUsers={chat.users.length}
                                chatName={chat.topic}
                                msgAuthor={chat["last_message"].id}
                                page={props.areaType}
                                chatUsers={chat.users}
                                msgText={chat["last_message"].content}
                                msgTime={displayMsgTimeInPrettyWay(chat["last_message"].dispatch_date)}
                            ></SingleChat></div>
                    )) : null
                }
            </div>
        )

    } else if (props.areaType === "pageProfile") {
        return (
            <div className="display-page-area">
                <div>
                    <CameraAltIcon className="page-profile-icon"></CameraAltIcon>
                </div>
                <div className={"page-profile-full-name"}>
                    <div className={"full-name-header"}>Full name</div>
                    <div className={"full-name-value"}>{props.profileName}</div>
                </div>
                <div className={"page-profile-username"}>
                    <div className={"username-header"}>Username</div>
                    <div className={"username-value"}>{props.profileUserName}</div>
                    {props.display_cur_user_account ?
                        <div className={"username-length-limit-hint"}>Minimum length is 5 characters</div> :
                        null}
                </div>
                <div className={"page-profile-bio"}>
                    <div className={"bio-header"}>Bio</div>
                    <div className={"bio-value"}>YoY! It's me</div>
                    {props.display_cur_user_account ? <div className={"bio-value-hint"}>Any details about you</div> :
                        null}
                </div>
                {props.display_cur_user_account ? <LogoutButton></LogoutButton> :
                    null}
            </div>)
    }
}

