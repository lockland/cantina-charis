import { showNotification } from "@mantine/notifications"

const NOTIFICATION_TITLE = "Novo pedido"
const NOTIFICATION_MESSAGE = "Um novo pedido foi registrado no caixa."

/** Pico do ganho; navegadores exigem gesto antes de tocar áudio. */
const CHIME_PEAK_GAIN = 0.28

let sharedAudioContext: AudioContext | null = null
let chimePendingUntilUnlock = false

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null
  }
  if (sharedAudioContext !== null) {
    return sharedAudioContext
  }
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (AudioContextClass === undefined) {
    return null
  }
  sharedAudioContext = new AudioContextClass()
  return sharedAudioContext
}

function playTone(
  context: AudioContext,
  frequencyHz: number,
  startTimeSeconds: number,
  durationSeconds: number,
): void {
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(frequencyHz, startTimeSeconds)
  gainNode.gain.setValueAtTime(0.001, startTimeSeconds)
  gainNode.gain.linearRampToValueAtTime(CHIME_PEAK_GAIN, startTimeSeconds + 0.015)
  gainNode.gain.linearRampToValueAtTime(0.001, startTimeSeconds + durationSeconds)
  oscillator.connect(gainNode)
  gainNode.connect(context.destination)
  oscillator.start(startTimeSeconds)
  oscillator.stop(startTimeSeconds + durationSeconds + 0.06)
}

function scheduleChimeOscillators(context: AudioContext): void {
  const start = context.currentTime
  playTone(context, 784, start, 0.12)
  playTone(context, 1046.5, start + 0.14, 0.15)
}

function tryPlayChimeNow(context: AudioContext): boolean {
  if (context.state !== "running") {
    return false
  }
  scheduleChimeOscillators(context)
  return true
}

/**
 * Chame após clique/toque na página: faz resume do AudioContext e toca bipe pendente.
 */
export function primeKitchenAudioFromUserGesture(): void {
  const context = getOrCreateAudioContext()
  if (context === null) {
    return
  }
  void context.resume().then(() => {
    if (chimePendingUntilUnlock && tryPlayChimeNow(context)) {
      chimePendingUntilUnlock = false
    }
  }).catch(() => {
    /* ignorar */
  })
}

/**
 * Dois bipes. Se o contexto ainda estiver suspenso (sem gesto), marca pendente e toca no próximo unlock.
 */
export function playNewOrderChime(): void {
  const context = getOrCreateAudioContext()
  if (context === null) {
    return
  }
  void context.resume().then(() => {
    if (tryPlayChimeNow(context)) {
      chimePendingUntilUnlock = false
      return
    }
    chimePendingUntilUnlock = true
  }).catch(() => {
    chimePendingUntilUnlock = true
  })
}

/**
 * Toast Mantine + som para novo pedido.
 */
export function notifyNewOrderFromCashRegister(): void {
  showNotification({
    title: NOTIFICATION_TITLE,
    message: NOTIFICATION_MESSAGE,
    color: "teal",
    autoClose: 8000,
  })
  playNewOrderChime()
}
