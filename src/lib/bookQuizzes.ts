export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number; // 0-based index into options
}

export interface QuizResult {
  score: number;
  total: number;
  date: string; // ISO date
}

// Map book slug → questions. Add entries here as books are added to the library.
// Questions should be appropriate for the book's target age range.
const QUIZZES: Record<string, QuizQuestion[]> = {
  // Example (replace slug with real book slugs):
  // "the-magical-adventure": [
  //   {
  //     question: "What did Luna find in the forest?",
  //     options: ["A hidden path", "A treasure chest", "A lost puppy", "A magic wand"],
  //     correct: 0,
  //   },
  // ],
};

export function getQuiz(slug: string): QuizQuestion[] {
  return QUIZZES[slug] ?? [];
}

const LS_PREFIX = "wk_quiz_";

export function saveQuizResult(bookId: string, score: number, total: number): void {
  try {
    const raw = localStorage.getItem(LS_PREFIX + bookId);
    const results: QuizResult[] = raw ? JSON.parse(raw) : [];
    results.push({ score, total, date: new Date().toISOString().slice(0, 10) });
    localStorage.setItem(LS_PREFIX + bookId, JSON.stringify(results.slice(-10)));
  } catch { /* ignore */ }
}

export function getBestScore(bookId: string): QuizResult | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + bookId);
    if (!raw) return null;
    const results: QuizResult[] = JSON.parse(raw);
    return results.reduce((best, r) =>
      r.score / r.total > (best?.score ?? 0) / (best?.total ?? 1) ? r : best, results[0]);
  } catch { return null; }
}
