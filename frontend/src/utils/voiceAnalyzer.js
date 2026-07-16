export const analyzeVoice = (
  transcript,
  durationInSeconds
) => {

  const words = transcript
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const totalWords = words.length;

  const minutes = durationInSeconds / 60;

  const wpm = minutes > 0
    ? Math.round(totalWords / minutes)
    : 0;

  const fillerList = [
    "um",
    "uh",
    "like",
    "actually",
    "basically",
    "you know",
    "hmm"
  ];

  let fillerCount = 0;

  words.forEach((word) => {

    if (
      fillerList.includes(
        word.toLowerCase()
      )
    ) {

      fillerCount++;

    }

  });

  let speed = "Normal";

  if (wpm < 100)
    speed = "Slow";

  if (wpm > 160)
    speed = "Fast";

  let confidence = 100;

  confidence -= fillerCount * 2;

  if (confidence < 0)
    confidence = 0;

  return {

    totalWords,

    duration: durationInSeconds,

    wordsPerMinute: wpm,

    speakingSpeed: speed,

    fillerWords: fillerCount,

    confidence,

  };

};