import { useState } from "react";

function AddChannelModal () {
    // state
    const [channelId, setChannelId] = useState(false);

    // behavior
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannelId(event.target.value);
    }

    // render
    return (
        <div className="modal">
            <div className="modal-content text-black">
                <h2>Add Channel</h2>
                <input
                value={channelId}
                type="text"
                placeholder="Type the channel id..."
                onChange={handleChange}
                />
            </div>
        </div>
    )
}

export default AddChannelModal;