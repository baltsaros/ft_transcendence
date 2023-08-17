// src/components/Paddle.js

const Paddle = ({ x, y, width, height }) => {
  return <div style={{ position: 'absolute', left: x, top: y, width, height, backgroundColor: 'white' }} />;
};

export default Paddle;
