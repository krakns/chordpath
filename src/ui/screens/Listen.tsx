import { useEffect, useReducer, useRef, type ReactNode } from 'react'
import { PITCH_CLASSES, type Chroma } from '../../listener/chroma'
import {
  CHORD_MS,
  CHORD_FRAMES,
  QUIET_MS,
  TARGET_LEVEL,
  loadCalibration,
  saveCalibration,
  type Calibration,
  type CalibrationStep,
} from '../../listener/calibration'
import { isPermissionDenied, messageOf, startListening, type Handle } from '../../listener/listener'
import { calibrationOf, IDLE, reduceListener, type ListenView } from '../../listener/state'

export function Listen() {
  const [state, dispatch] = useReducer(reduceListener, IDLE)
  const handle = useRef<Handle | null>(null)

  const stop = () => {
    handle.current?.stop()
    handle.current = null
    dispatch({ type: 'stop' })
  }

  const start = () => {
    dispatch({ type: 'start' })
    startListening((chroma, level) => dispatch({ type: 'frame', chroma, level, now: Date.now() }))
      .then((started) => {
        handle.current = started
        dispatch({ type: 'granted', calibration: loadCalibration(), now: Date.now() })
      })
      .catch((error: unknown) => {
        dispatch(isPermissionDenied(error) ? { type: 'denied' } : { type: 'failed', message: messageOf(error) })
      })
  }

  useEffect(() => () => handle.current?.stop(), [])

  const heard =
    state.kind === 'listening' && state.view.kind === 'calibrating' && state.view.step.kind === 'heard'
      ? state.view.step.calibration
      : null
  useEffect(() => {
    if (heard) saveCalibration(heard)
  }, [heard])

  switch (state.kind) {
    case 'idle':
      return (
        <Screen title="Listen">
          <Stored />
          <p>Put the device on the piano, then tap to start. The first run calibrates to the room.</p>
          <button type="button" className="listen__button" onClick={start}>
            Start listening
          </button>
        </Screen>
      )
    case 'requesting':
      return (
        <Screen title="Listen">
          <p>Asking for the microphone.</p>
        </Screen>
      )
    case 'denied':
      return (
        <Screen title="Microphone blocked">
          <p>Allow the microphone for this site in Settings, then try again.</p>
          <button type="button" className="listen__button" onClick={start}>
            Try again
          </button>
        </Screen>
      )
    case 'error':
      return (
        <Screen title="Could not listen">
          <p>{state.message}</p>
          <button type="button" className="listen__button" onClick={start}>
            Try again
          </button>
        </Screen>
      )
    case 'listening':
      return (
        <Live
          view={state.view}
          chroma={state.chroma}
          level={state.level}
          onRecalibrate={() => dispatch({ type: 'recalibrate', now: Date.now() })}
          onStop={stop}
        />
      )
  }
}

function Screen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="screen listen">
      <h1 className="listen__title">{title}</h1>
      {children}
      <a className="listen__back" href="#home">
        Back
      </a>
    </main>
  )
}

function Stored() {
  const calibration = loadCalibration()
  if (!calibration) return null
  return <p className="listen__muted">Calibrated {new Date(calibration.measuredAt).toLocaleString()}.</p>
}

function Live({
  view,
  chroma,
  level,
  onRecalibrate,
  onStop,
}: {
  view: ListenView
  chroma: Chroma
  level: number
  onRecalibrate: () => void
  onStop: () => void
}) {
  const calibration = calibrationOf(view)
  const controls = (
    <div className="listen__controls">
      {calibration && (
        <button type="button" className="listen__button listen__button--secondary" onClick={onRecalibrate}>
          Recalibrate
        </button>
      )}
      <button type="button" className="listen__button listen__button--secondary" onClick={onStop}>
        Stop
      </button>
    </div>
  )

  if (view.kind === 'meter') {
    return (
      <Screen title="Listening">
        <Meter chroma={chroma} level={level} calibration={calibration} />
        {controls}
      </Screen>
    )
  }
  return (
    <CalibrationView step={view.step} chroma={chroma} level={level} onRetry={onRecalibrate}>
      {controls}
    </CalibrationView>
  )
}

function CalibrationView({
  step,
  chroma,
  level,
  onRetry,
  children,
}: {
  step: CalibrationStep
  chroma: Chroma
  level: number
  onRetry: () => void
  children: ReactNode
}) {
  const secondsLeft = (startedAt: number, total: number) =>
    Math.max(0, Math.ceil((startedAt + total - Date.now()) / 1000))
  switch (step.kind) {
    case 'quiet':
      return (
        <Screen title="Stay quiet">
          <p className="listen__big">{secondsLeft(step.startedAt, QUIET_MS)}</p>
          <p>Measuring the room noise.</p>
          <LevelBar level={level} calibration={null} />
          {children}
        </Screen>
      )
    case 'chord':
      return (
        <Screen title="Play a C major chord and hold it">
          <p className="listen__big">{secondsLeft(step.startedAt, CHORD_MS)}</p>
          <p>
            Heard {step.hitLevels.length} of {CHORD_FRAMES} frames.
          </p>
          <Meter chroma={chroma} level={level} calibration={null} />
          {children}
        </Screen>
      )
    case 'failed':
      return (
        <Screen title="Did not hear it">
          <p>{step.message}</p>
          <button type="button" className="listen__button" onClick={onRetry}>
            Retry
          </button>
          {children}
        </Screen>
      )
    case 'heard':
      return (
        <Screen title="Heard it">
          <p className="listen__muted">Calibration saved. Gain {step.calibration.gain.toFixed(2)}.</p>
          <Meter chroma={chroma} level={level} calibration={step.calibration} />
          {children}
        </Screen>
      )
  }
}

function Meter({ chroma, level, calibration }: { chroma: Chroma; level: number; calibration: Calibration | null }) {
  const peak = Math.max(...chroma)
  return (
    <div className="meter">
      <div className="meter__bars" role="img" aria-label="Chroma meter">
        {PITCH_CLASSES.map((name, i) => (
          <div key={name} className="meter__bar">
            <div
              className={`meter__fill${chroma[i] > 1 / 12 ? ' meter__fill--active' : ''}`}
              style={{ height: `${peak > 0 ? (chroma[i] / peak) * 100 : 0}%` }}
            />
            <span className="meter__label">{name}</span>
          </div>
        ))}
      </div>
      <LevelBar level={level} calibration={calibration} />
    </div>
  )
}

function LevelBar({ level, calibration }: { level: number; calibration: Calibration | null }) {
  const scaled = Math.min(1, (level * (calibration?.gain ?? 1)) / (TARGET_LEVEL * 2))
  return (
    <div className="level" role="meter" aria-label="Level" aria-valuemin={0} aria-valuemax={1} aria-valuenow={scaled}>
      <div className="level__fill" style={{ width: `${scaled * 100}%` }} />
    </div>
  )
}
