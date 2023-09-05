/**
 * @file This file contains helper methods to perform musical / audio 
 * calculationss. Most importantly, it contains the current pitch detection 
 * algorithm. Most of the moethods / consts are just conversions not 
 * directly related to pitch detection, but necessary to work in the domain. 
 * 
 * @todo The actual pitch detection should be separated into its own lib
 * and the rest of this should be wrapped up into a Pitch class. 
 */

/**
 * String representation of music notes. 
 * @constant {Array<String>} NOTE_STRINGS
 */
const NOTE_STRINGS = Object.freeze([
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]);

/**
 * MIDI note values [0-127]. 
 * @constant {Array<Number>} MIDI_NOTES
 */
const MIDI_NOTES = Object.freeze(
  Array.from({ length: 128 }, (_, index) => index + 1),
);

/**
 * Returns the string representation of a midi note. 
 * @param {Number} midiNote [0-127]
 * @returns {String} musical note (A4)
 */
export function noteToString(midiNote) {
  const octave = Math.floor((midiNote - 12) / 12);
  const noteName = NOTE_STRINGS[midiNote % 12];
  return `${noteName}${octave}`;
}

/**
 * Create a map of all possible MIDI notes to their string representations.
 * @description The math to convert a MIDI note to a string and number came 
 * from two different sources. This map creates a cache of the relevant values 
 * which will not change for our purposes. 
 * @constant {Map<String, Number>} midiNoteMap
 */
const midiNoteMap = new Map();
for (const note of MIDI_NOTES) {
  midiNoteMap.set(noteToString(note), note);
}

/**
 * Return the MIDI note for a musical note. 
 * @param {String} str 
 * @returns {Number|undefined}
 */
export function stringToNote(str) {
  return midiNoteMap.get(str);
}

/**
 * Returns the string of the nearest MIDI note for a given frequency.
 * @param {Number} freq Hz
 * @returns {String} C1, A4, etc. 
 */
export function frequencyToNote(freq) {
  const note = Math.round(69 + 12 * Math.log2(freq / 440));
  return noteToString(note);
}

/**
 * Convert a MIDI note to its corresponding frequency in Hz. 
 * @param {Number} note MIDI note [0-127]
 * @returns {Number} Hz
 */
export function noteToFrequency(note) {
  return Math.pow(2, (note - 69) / 12) * 440;
}

/**
 * Find the frequency in Hz of the frequency bin of the output of an FFT. 
 * @param {Float32Array} fft output from AnalyserNode.getFloatFrequencyData
 * @param {Number} fftSize original FFT size, not fft.length
 * @param {Number} sampleRate in Hz
 * @returns {Number} frequency in Hz
 */
export function maxFftFrequency(fft, fftSize, sampleRate) {
  let maxBinIndex = -1;
  let maxBinValue = -Infinity;

  for (let i = 0; i < fft.length; i++) {
    if (fft[i] > maxBinValue) {
      maxBinIndex = i;
      maxBinValue = fft[i];
    }
  }
  return (maxBinIndex * sampleRate) / fftSize;
}
