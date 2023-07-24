import { FC } from "react";
import { useEffect, useState } from 'react'
import ftLogo from '../assets/42_Logo.svg'

const Home: FC = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch('/api')
  }, []);
  return (
    <>
      <div>
        <a href="https://profile.intra.42.fr/" target="_blank">
          <img src={ftLogo} className="logo" alt="42 logo" />
        </a>
      </div>
      <h1>Under construction...</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the 42 to be redirected...
      </p>
    </>
  )
}

export default Home