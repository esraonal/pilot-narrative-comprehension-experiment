'use strict';

// Practice is deliberately unrelated to the research narratives:
// no observer-perspective setup, sensory-access condition, or
// looks/sounds/seems critical predicate. Only the reading and answering
// interface matches the main experiment.
window.PRACTICE_STORIES = [{
  row: {
    is_practice: true,
    item_id: 'practice_bookmark_contest',
    title: 'Bookmark contest',
    // Four ordinary story sentences. Sentence 4 is divided at a natural
    // word boundary, not at "and" or at a study-specific predicate.
    practice_sentences: [
      'The school library is holding a bookmark-design contest.',
      'Nina chooses green paper and draws a yellow star on it.',
      'She places her finished bookmark in a blue envelope for the judges.',
      'At the end of the afternoon, Nina receives'
    ],
    practice_continuation: 'a ribbon for her colorful design.'
  },
  options: {
    item_id: 'practice_bookmark_contest',
    // Questions deliberately do not ask about observer location,
    // perceptual attribution, sensory access, or observer activity.
    questions: [
      {
        id: 'contest',
        prompt: 'What were people making for the contest?',
        choices: ['Bookmarks', 'Paper airplanes', 'Posters', 'Greeting cards'],
        correct_index: 1
      },
      {
        id: 'paper_color',
        prompt: 'What color paper did Nina choose?',
        choices: ['Yellow', 'Green', 'Red', 'Purple'],
        correct_index: 2
      },
      {
        id: 'drawing',
        prompt: 'What did Nina draw on her paper?',
        choices: ['A blue heart', 'A green leaf', 'A yellow star', 'A red flower'],
        correct_index: 3
      },
      {
        id: 'envelope',
        prompt: 'Where did Nina put her finished bookmark?',
        choices: ['In a wooden box', 'Inside a notebook', 'On a table', 'In a blue envelope'],
        correct_index: 4
      }
    ],
    rating_prompt: 'The sequence of events in the story was easy to follow.'
  }
}];
