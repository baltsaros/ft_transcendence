function MsgList() {
    // state
    const dummyData = [
        {
            senderId: "hdony",
            text: "hello"
        },
        {
            senderId: "jvander",
            text: "hey"
        }
    ]

    // behavior

    // render
    return (
        <ul>
            dummyData.map(message => {
                return (
                    <li key={message.id}>
                      <div>
                        {message.senderId}
                      </div>
                      <div>
                        {message.text}
                      </div>
                    </li>
                  )
                })
              </ul>
             )
}