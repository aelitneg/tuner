import { createContext, useEffect, useState } from 'react';

const PageContext = createContext();

function PageProvider({ children }) {
  const [audioContext, setAudioContext] = useState();
  const [mediaDevices, setMediaDevices] = useState([]);

  useEffect(() => {
    (async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaDevices(await navigator.mediaDevices.enumerateDevices());
      setAudioContext(new AudioContext());
    })();
  }, []);

  return (
    <PageContext.Provider
      value={{ audioContext, setAudioContext, mediaDevices }}
    >
      {children}
    </PageContext.Provider>
  );
}

export { PageContext, PageProvider };
