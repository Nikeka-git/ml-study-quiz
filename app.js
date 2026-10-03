'use strict';
(() => {
  const questions = window.QUIZ_QUESTIONS;
  const byId = new Map(questions.map(q => [q.id, q]));
  const $ = id => document.getElementById(id);
  const storageKey = 'ml-practice-v1';
  const randomize = values => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { saved = null; }
  let best = Number.isFinite(saved?.best) ? saved.best : null;
  let mistakes = new Set((Array.isArray(saved?.mistakes) ? saved.mistakes : []).filter(id => byId.has(id)));
  let shuffle = typeof saved?.shuffle === 'boolean' ? saved.shuffle : true;
  let session = validSession(saved?.session) ? saved.session : makeSession(questions.map(q => q.id), 'full');
  let selected = null;
  let guideOpen = false;
  let renderVersion = 0;
  $('shuffle').checked = shuffle;

  function validSession(s) {
    return s && ['full', 'mistakes'].includes(s.mode) && Array.isArray(s.ids) && s.ids.length > 0 &&
      new Set(s.ids).size === s.ids.length && s.ids.every(id => byId.has(id)) &&
      Number.isInteger(s.index) && s.index >= 0 && s.index < s.ids.length &&
      s.answers && typeof s.answers === 'object' && s.optionOrders &&
      s.ids.every(id => !byId.get(id).options || (Array.isArray(s.optionOrders[id]) &&
        s.optionOrders[id].length === byId.get(id).options.length &&
        [...s.optionOrders[id]].sort().every((value, i) => value === i)));
  }
  function makeSession(ids, mode) {
    const ordered = shuffle ? randomize(ids) : [...ids];
    const optionOrders = {};
    ordered.forEach(id => {
      const q = byId.get(id);
      if (q.options) optionOrders[id] = shuffle ? randomize(q.options.map((_, i) => i)) : q.options.map((_, i) => i);
    });
    return { ids: ordered, mode, index: 0, answers: {}, optionOrders, finished: false, recorded: false };
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify({ best, mistakes: [...mistakes], shuffle, session })); } catch { /* Practice also works without browser storage. */ }
  }
  function counts() {
    const answers = session.ids.map(id => session.answers[id]).filter(Boolean);
    return { answered: answers.length, correct: answers.filter(a => a.correct).length };
  }
  function answerText(q) { return q.options ? q.options[q.correctIndex] : q.answerDisplay || String(q.answer); }
  function updateSidebar() {
    const stats = counts();
    $('session-label').textContent = session.mode === 'mistakes' ? 'Mistake practice' : 'Full practice';
    $('session-count').textContent = `${session.ids.length} question${session.ids.length === 1 ? '' : 's'}`;
    $('progress-fill').style.width = `${stats.answered / session.ids.length * 100}%`;
    $('progress').setAttribute('aria-valuemax', session.ids.length);
    $('progress').setAttribute('aria-valuenow', stats.answered);
    $('progress-text').textContent = `${stats.answered} of ${session.ids.length} answered`;
    $('correct-stat').textContent = stats.correct;
    $('mistake-stat').textContent = stats.answered - stats.correct;
    $('best-stat').textContent = best === null ? '—' : `${best}%`;
    $('mistake-count').textContent = mistakes.size;
    $('retry-mistakes').disabled = mistakes.size === 0;
    $('question-map').replaceChildren();
    session.ids.forEach((id, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'map-button';
      button.textContent = id;
      button.setAttribute('aria-label', `Source question ${id}${session.answers[id] ? session.answers[id].correct ? ', correct' : ', to review' : ', unanswered'}`);
      if (index === session.index && !session.finished) { button.classList.add('current'); button.setAttribute('aria-current', 'step'); }
      if (session.answers[id]) button.classList.add(session.answers[id].correct ? 'correct' : 'wrong');
      button.addEventListener('click', () => { session.index = index; session.finished = false; guideOpen = false; persist(); render(); });
      $('question-map').append(button);
    });
  }
  function showFeedback(q, record) {
    $('feedback').hidden = !record;
    if (!record) return;
    $('feedback').className = `feedback${record.revealed ? ' revealed' : record.correct ? '' : ' incorrect'}`;
    $('feedback-heading').textContent = record.revealed ? 'Answer revealed · added to review' : record.correct ? 'Correct. Nicely done.' : 'Not quite. Here is why.';
    $('correct-answer').textContent = `Correct answer: ${answerText(q)}`;
    $('explanation').textContent = q.explanation;
  }
  function renderQuestion() {
    renderVersion++;
    const q = byId.get(session.ids[session.index]);
    const record = session.answers[q.id];
    selected = record && q.options ? record.value : null;
    $('question-position').textContent = `QUESTION ${String(session.index + 1).padStart(2, '0')} / ${session.ids.length}`;
    $('topic').textContent = q.topic;
    $('source-number').textContent = `Source question ${q.id}`;
    $('question-prompt').textContent = q.prompt;
    $('question-code').hidden = !q.code;
    $('question-code').querySelector('code').textContent = q.code || '';
    $('source-note').hidden = !q.note;
    $('source-note').textContent = q.note || '';
    $('choices').hidden = !q.options;
    $('numeric-wrap').hidden = Boolean(q.options);
    $('choices').replaceChildren();
    const legend = document.createElement('legend'); legend.className = 'sr-only'; legend.textContent = 'Choose an answer'; $('choices').append(legend);
    if (q.options) session.optionOrders[q.id].forEach((optionIndex, displayIndex) => {
      const label = document.createElement('label'); label.className = 'choice';
      const input = document.createElement('input'); input.type = 'radio'; input.name = 'answer'; input.value = optionIndex;
      input.checked = selected === optionIndex; input.disabled = Boolean(record);
      const letter = document.createElement('span'); letter.className = 'choice-letter'; letter.textContent = String.fromCharCode(65 + displayIndex); letter.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span'); text.textContent = q.options[optionIndex];
      if (input.checked) label.classList.add('selected');
      if (record) {
        label.classList.add('locked');
        if (optionIndex === q.correctIndex) label.classList.add('correct-choice');
        if (selected === optionIndex && !record.correct) label.classList.add('wrong-choice');
      }
      input.addEventListener('change', () => {
        selected = optionIndex;
        $('choices').querySelectorAll('.choice').forEach(choice => choice.classList.toggle('selected', choice.querySelector('input').checked));
        $('form-error').hidden = true;
      });
      label.append(input, letter, text); $('choices').append(label);
    });
    $('numeric-answer').value = record && !q.options && !record.revealed ? record.value : '';
    $('numeric-answer').disabled = Boolean(record);
    $('check-answer').hidden = Boolean(record);
    $('reveal').hidden = Boolean(record);
    $('answer-actions').hidden = Boolean(record);
    $('form-error').hidden = true;
    $('previous').disabled = session.index === 0;
    $('next').textContent = session.index === session.ids.length - 1 ? 'View results' : 'Next question';
    showFeedback(q, record);
  }
  function render() {
    $('guide-panel').hidden = !guideOpen;
    $('quiz-panel').hidden = guideOpen || session.finished;
    $('results-panel').hidden = guideOpen || !session.finished;
    $('study-toggle').textContent = guideOpen ? 'Back to practice' : 'Answer guide';
    updateSidebar();
    if (guideOpen) return;
    if (session.finished) renderResults(); else renderQuestion();
  }
  function grade(revealed = false) {
    const q = byId.get(session.ids[session.index]);
    if (session.answers[q.id]) return;
    let value = selected;
    if (!revealed) {
      if (q.options && selected === null) return error('Choose an answer first.');
      if (!q.options) {
        const raw = $('numeric-answer').value.trim().replace(',', '.');
        if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw) || !Number.isFinite(Number(raw))) return error('Enter a valid number first.');
        value = Number(raw);
      }
    }
    const correct = !revealed && (q.options ? value === q.correctIndex : Math.abs(value - q.answer) < 0.005);
    session.answers[q.id] = { value: revealed ? null : value, correct, revealed };
    if (correct) mistakes.delete(q.id); else mistakes.add(q.id);
    persist(); render();
  }
  function error(message) { $('form-error').textContent = message; $('form-error').hidden = false; }
  function next() {
    if (session.index < session.ids.length - 1) { session.index++; persist(); render(); }
    else { finish(); }
  }
  function finish() {
    const stats = counts();
    session.finished = true;
    if (stats.answered === session.ids.length && session.mode === 'full' && session.ids.length === questions.length && !session.recorded) {
      const score = Math.round(stats.correct / session.ids.length * 100);
      best = best === null ? score : Math.max(best, score);
      session.recorded = true;
    }
    persist(); render(); $('results-panel').focus();
  }
  function button(text, className, action) {
    const b = document.createElement('button'); b.type = 'button'; b.className = className; b.textContent = text; b.addEventListener('click', action); return b;
  }
  function start(mode = 'full') {
    const ids = mode === 'mistakes' ? questions.filter(q => mistakes.has(q.id)).map(q => q.id) : questions.map(q => q.id);
    if (!ids.length) return;
    session = makeSession(ids, mode); guideOpen = false; persist(); render();
  }
  function renderResults() {
    const stats = counts(); const total = session.ids.length; const missed = session.ids.filter(id => !session.answers[id]?.correct);
    const panel = $('results-panel'); panel.replaceChildren();
    const eyebrow = document.createElement('div'); eyebrow.className = 'eyebrow'; eyebrow.textContent = stats.answered === total ? 'ATTEMPT COMPLETE' : 'YOUR PROGRESS SO FAR';
    const title = document.createElement('h2'); title.textContent = stats.correct === total ? 'You have got this.' : 'A little closer, every time.';
    const score = document.createElement('div'); score.className = 'result-score'; score.textContent = stats.correct;
    const denominator = document.createElement('span'); denominator.textContent = ` / ${total}`; score.append(denominator);
    const caption = document.createElement('p'); caption.className = 'result-caption';
    caption.textContent = `${Math.round(stats.correct / total * 100)}% correct · ${stats.answered - stats.correct} to review · ${total - stats.answered} unanswered. ${missed.length ? 'Review the explanations, then give it another try.' : 'Try a shuffled attempt to check that it sticks.'}`;
    const actions = document.createElement('div'); actions.className = 'result-actions';
    actions.append(button('Try all questions again', 'primary-button', () => start()));
    if (mistakes.size) actions.append(button('Practice saved mistakes', 'nav-button', () => start('mistakes')));
    if (stats.answered < total) actions.append(button('Continue this attempt', 'nav-button', () => { session.index = session.ids.findIndex(id => !session.answers[id]); session.finished = false; persist(); render(); }));
    actions.append(button('Read the answer guide', 'text-button', toggleGuide));
    panel.append(eyebrow, title, score, caption, actions);
    if (missed.length) {
      const review = document.createElement('div'); review.className = 'result-review';
      const h3 = document.createElement('h3'); h3.textContent = 'Worth another look'; review.append(h3);
      missed.forEach(id => {
        const q = byId.get(id); const b = button('', 'review-button', () => { session.index = session.ids.indexOf(id); session.finished = false; persist(); render(); });
        const label = document.createElement('strong'); label.textContent = `QUESTION ${id} · ${session.answers[id] ? 'Review' : 'Unanswered'}`;
        const text = document.createElement('span'); text.textContent = q.prompt;
        b.append(label, text); review.append(b);
      });
      panel.append(review);
    }
  }
  function buildGuide() {
    questions.forEach(q => {
      const item = document.createElement('details'); item.className = 'guide-item';
      const summary = document.createElement('summary'); const label = document.createElement('span'); label.textContent = `QUESTION ${q.id} / ${q.topic.toUpperCase()}`; const prompt = document.createElement('div'); prompt.textContent = q.prompt; summary.append(label, prompt);
      const detail = document.createElement('div'); detail.className = 'guide-detail';
      if (q.code) { const pre = document.createElement('pre'); pre.textContent = q.code; detail.append(pre); }
      const answer = document.createElement('p'); answer.className = 'guide-answer'; answer.textContent = `Answer: ${answerText(q)}`;
      const explanation = document.createElement('p'); explanation.textContent = q.explanation; detail.append(answer, explanation);
      if (q.note) { const note = document.createElement('p'); note.className = 'source-note'; note.textContent = q.note; detail.append(note); }
      item.append(summary, detail); $('guide-list').append(item);
    });
  }
  function toggleGuide() { guideOpen = !guideOpen; render(); }
  $('answer-form').addEventListener('submit', event => { event.preventDefault(); grade(); });
  $('reveal').addEventListener('click', () => grade(true));
  $('next').addEventListener('click', next);
  $('previous').addEventListener('click', () => { if (session.index > 0) { session.index--; persist(); render(); } });
  $('study-toggle').addEventListener('click', toggleGuide);
  $('back-to-quiz').addEventListener('click', toggleGuide);
  $('shuffle').addEventListener('change', () => { shuffle = $('shuffle').checked; persist(); });
  $('restart').addEventListener('click', () => {
    if (!counts().answered || session.finished) start(); else $('restart-dialog').showModal();
  });
  $('restart-dialog').addEventListener('close', () => { if ($('restart-dialog').returnValue === 'confirm') start(); });
  $('retry-mistakes').addEventListener('click', () => start('mistakes'));
  document.addEventListener('keydown', event => {
    if (guideOpen || session.finished || $('restart-dialog').open || event.ctrlKey || event.metaKey || event.altKey) return;
    const q = byId.get(session.ids[session.index]);
    if (/^[1-4]$/.test(event.key) && q.options && !session.answers[q.id] && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
      const input = $('choices').querySelectorAll('input')[Number(event.key) - 1];
      if (input) { event.preventDefault(); input.checked = true; input.dispatchEvent(new Event('change')); }
    }
    if (event.key === 'Enter' && !['BUTTON', 'A', 'SUMMARY'].includes(event.target.tagName)) {
      event.preventDefault(); if (session.answers[q.id]) next(); else grade();
    }
  });
  buildGuide(); render(); persist();
  if (document.modelContext?.registerTool) {
    const lifecycle = new AbortController();
    const register = tool => {
      try { Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional browser API. */ }
    };
    register({ name: 'read_quiz_progress', description: 'Read the current question, answers, progress and saved mistake count.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute() { const q = byId.get(session.ids[session.index]); return { questionId: q.id, prompt: q.prompt, options: q.options || null, answered: Boolean(session.answers[q.id]), ...counts(), total: session.ids.length, mistakes: mistakes.size }; } });
    register({ name: 'start_quiz_attempt', description: 'Start a new full or saved-mistakes quiz, replacing the current attempt.', inputSchema: { type: 'object', properties: { mode: { type: 'string', enum: ['full', 'mistakes'] } }, required: ['mode'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute(input) { if (!input || !['full', 'mistakes'].includes(input.mode)) throw new Error('Expected mode full or mistakes.'); if (input.mode === 'mistakes' && !mistakes.size) throw new Error('There are no saved mistakes.'); start(input.mode); return { mode: session.mode, total: session.ids.length }; } });
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }
})();
