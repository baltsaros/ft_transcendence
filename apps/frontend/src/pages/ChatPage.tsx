/* The variable Chat gets assigned the value of an arrow function
** The arrow function is a functional component (= javascript function) of React 
** Components are used to encapsulate part of the UI to be, here a javascript function */
import Chat from "../components/Chat";
import Channels from "../components/Channels";
import PlayersOnServer from "../components/PlayersOnServer";

function SimpleChat() {
    // state, données dynamiques

    // behavior

    // render (jsx)
    return (
    <div className="flex items-stretch justify-center">
        <Channels />
        <Chat />
        {/* <PlayersOnServer /> */}
    </div>
    );
}

export default SimpleChat;