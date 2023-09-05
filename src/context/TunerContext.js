import { createContext, useContext, useEffect, useState } from 'react';
import { PageContext } from './PageContext';

const TunerContext = createContext();

function TunerProvider({ children }) {
  const { audioContext } = useContext(PageContext);
  const [inputNode, setInputNode] = useState();
  const [analyserNode, setAnalyserNode] = useState();

  const [selectedInput, setSelectedInput] = useState();
  const [mode, setMode] = useState('Manual');
  const [selectedNote, setSelectedNote] = useState(-1);

  useEffect(() => {
    (async () => {
      if (selectedInput) {
        if (audioContext.state !== 'running') audioContext.resume();
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: selectedInput.deviceId },
        });

        setInputNode(audioContext.createMediaStreamSource(stream));
        setAnalyserNode(audioContext.createAnalyser());
      }
    })();
  }, [audioContext, selectedInput]);

  useEffect(() => {
    if (inputNode && analyserNode) {
      analyserNode.fftSize = 32768;
      inputNode.connect(analyserNode);
    }
  }, [inputNode, analyserNode]);

  return (
    <TunerContext.Provider
      value={{
        selectedInput,
        setSelectedInput,
        mode,
        setMode,
        selectedNote,
        setSelectedNote,
        analyserNode,
      }}
    >
      {children}
    </TunerContext.Provider>
  );
}

export { TunerContext, TunerProvider };
