const Ball = ({ x, y, size }) => {
	return <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, backgroundColor: 'white', borderRadius: '50%' }} />;
  };

export default Ball;