'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { PageContext } from '@/context/PageContext';
import { TunerContext } from '@/context/TunerContext';
import { noteToString, noteToFrequency, stringToNote } from '@/lib/audioUtils';
import Canvas from './Canvas';
import styles from './tuner.module.css';

export default function Tuner() {
  const { mediaDevices } = useContext(PageContext);
  const {
    mode,
    setMode,
    selectedInput,
    setSelectedInput,
    selectedNote,
    setSelectedNote,
  } = useContext(TunerContext);
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    if (mediaDevices) {
      setInputs(mediaDevices.filter((input) => input.kind == 'audioinput'));
    }
  }, [mediaDevices]);

  function onSelectInputChange(e) {
    setSelectedInput(
      mediaDevices.find(
        (mediaDevice) => mediaDevice.deviceId === e.target.value,
      ),
    );
  }

  function onInputSelectedNoteChange(e) {
    const note = stringToNote(e.target.value) || -1;
    setSelectedNote(note);
  }

  function renderMode() {
    switch (mode) {
      case 'Manual':
        return (
          <>
            <label className={styles.label}>Note:</label>
            <input
              className={styles.input}
              onChange={onInputSelectedNoteChange}
            />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <label className={styles.label}>Input:</label>
        <select
          className={styles.select}
          value={selectedInput?.deviceId}
          onChange={onSelectInputChange}
        >
          <option value={null}>(none)</option>
          {inputs.map((input) => (
            <option value={input.deviceId} key={input.deviceId}>
              {input.label}
            </option>
          ))}
        </select>
        <label className={styles.label}>Mode:</label>
        <select
          className={styles.select}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="Manual">Manual</option>
          {/* <option value="Auto">Auto (beta)</option> */}
        </select>
        {renderMode()}
      </div>
      <div
        className={`${styles.marginY} ${styles.textCenter} ${styles.fullWidth}`}
      >
        <Canvas />
      </div>
      <h2>{selectedNote > 0 ? noteToString(selectedNote) : '--'}</h2>
      <span className={styles.textSmall}>
        {selectedNote > 0
          ? noteToFrequency(selectedNote).toFixed(1) + ' Hz'
          : ''}
      </span>
    </div>
  );
}
