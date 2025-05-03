import { useEffect, useState } from "react";

const audioCache = new Map<string, HTMLAudioElement>();
function getAudioElement(src: string): HTMLAudioElement {
  if (!audioCache.has(src)) {
    audioCache.set(src, new Audio(src));
  }
  return audioCache.get(src) as HTMLAudioElement;
}

/**
 * Custom react hook for audio elements. Loads audio using an effect after
 * mounting the component, and caches it globally so reuisng the same audio
 * file will not trigger multiple http requests.
 *
 * @param src - location of audio file
 * @returns - react state containing HTMLAudioElement
 */
export function useAudio(src: string) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (src) {
      setAudio(getAudioElement(src));
    }
  }, [src]);

  return audio;
}
