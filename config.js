/* Edit this file before launching your experiment. */
window.EXPERIMENT_CONFIG = {
  // "pilot" = test locally and download one CSV at the end.
  // "datapipe" = assign one of 12 counterbalancing lists + online storage.
  mode: 'datapipe',
  datapipeExperimentId: 'iBTgP7TTdsD8', // 12-character ID from https://pipe.jspsych.org; set 12 lists in dashboard

  // The four pre-critical segments accumulate as full sentences through "and".
  // Only the continuation after "and" is word-by-word; other slots show dashes.
  fixationMs: 350,

  // One required practice narrative before the 24 experimental narratives.
  // After the first round, participants may repeat it once (optional).
  practiceItems: 1,
  breakAfterItems: [12],

  // Present four required multiple-choice questions and one required 1–5 rating.
  // You may change this later after piloting burden/quality.
  includeQuestions: true,

  // Optional: insert a complete Prolific return URL after data collection is configured.
  prolificCompletionUrl: ''
};
