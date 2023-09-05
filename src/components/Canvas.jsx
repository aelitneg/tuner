import { useContext, useEffect, useRef } from 'react';
import { maxFftFrequency, noteToFrequency } from '@/lib/audioUtils';
import { PageContext } from '@/context/PageContext';
import { TunerContext } from '@/context/TunerContext';
import styles from './canvas.module.css';

const clockRect = Object.freeze({ x: 0, y: 0, w: 64, h: 16, p: 2 });
const frequencyRect = Object.freeze({ w: 64, h: 16, p: 2 });
const meterRect = Object.freeze({ w: 16, h: 16, p: 2 });

/**
 * Render audioContext clock for debugging.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} [currentTime]
 */
function renderClock(ctx, currentTime = 0) {
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.clearRect(
    clockRect.x,
    clockRect.y,
    clockRect.w + clockRect.p,
    clockRect.h + clockRect.p,
  );
  ctx.fillStyle = 'black';
  ctx.fillText(
    Number(currentTime).toFixed(2),
    clockRect.x + clockRect.p / 2,
    clockRect.y + clockRect.p / 2,
    clockRect.w,
  );
}

/**
 * Render numeric frequency display.
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} rect
 * @param {number} frequency
 */
function renderFrequency(ctx, rect, frequency) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.clearRect(rect.x - rect.w / 2, rect.y, rect.w + rect.p, rect.h + rect.p);
  ctx.fillStyle = 'black';
  ctx.fillText(
    `${frequency.toFixed(2)} Hz`,
    rect.x + rect.p / 2,
    rect.y + rect.p,
    rect.w,
  );
}

/**
 * Render the frequency meter.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width width for meter motion
 * @param {*} rect meter element
 * @param {number} cents x offset based on frequency
 *
 * @returns {number} new x coordinate of meter
 */
function renderMeter(ctx, width, rect, cents = 0) {
  let x = width / 2 + cents;
  x = Math.max(rect.w / 2, Math.min(x, width - (rect.w / 2)));

  ctx.clearRect(0, rect.y - (rect.h / 2), width, rect.h);

  ctx.fillStyle = Math.abs(cents) < 10 ? 'green' : 'red';
  ctx.fillRect(x - (rect.w / 2), rect.y - (rect.h / 2), rect.w, rect.h);

  return x;
}

export default function Canvas({}) {
  const { audioContext } = useContext(PageContext);
  const audioContextRef = useRef(null);
  const { analyserNode, selectedNote } = useContext(TunerContext);
  const analyserNodeRef = useRef(null);
  const selectedNoteRef = useRef(null);
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const floatFrequencyDataRef = useRef(null);
  const meterRectRef = useRef({...meterRect});

  /**
   * Render animation frame to canvas.
   */
  function renderFrame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (process.env.NEXT_PUBLIC_DEBUG) {
      renderClock(ctx, audioContextRef.current.currentTime);
    }

    const referenceFrequency =
      selectedNoteRef.current > -1
        ? noteToFrequency(selectedNoteRef.current)
        : 0;
    let frequency = 0;
    let cents = 0;

    if (analyserNodeRef.current) {
      analyserNodeRef.current.getFloatFrequencyData(
        floatFrequencyDataRef.current,
      );

      frequency = maxFftFrequency(
        floatFrequencyDataRef.current,
        analyserNodeRef.current.fftSize,
        audioContextRef.current.sampleRate,
      );

      if (selectedNoteRef.current > -1) {
        cents = 1200 * Math.log2(frequency / referenceFrequency);
        meterRectRef.current.x = renderMeter(
          ctx,
          canvas.width,
          { ...meterRectRef.current, y: canvas.height / 2 },
          cents,
        );
      } else {
        ctx.clearRect(
          0,
          canvas.height / 2, 
          canvas.width,
          meterRectRef.current.h,
        );
      }
    }

    renderFrequency(
      ctx,
      {
        ...frequencyRect,
        x: canvas.width / 2,
        y: canvas.height - frequencyRect.h,
      },
      frequency,
    );
  }

  function tick() {
    if (!audioContextRef.current || !canvasRef.current) return;
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    audioContextRef.current = audioContext;
    analyserNodeRef.current = analyserNode;
    if (analyserNode) {
      floatFrequencyDataRef.current = new Float32Array(
        analyserNode.frequencyBinCount,
      );
    }
    requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, [audioContext, analyserNode]);

  useEffect(() => {
    selectedNoteRef.current = selectedNote;
  }, [selectedNote]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className={styles.border}
    ></canvas>
  );
}
