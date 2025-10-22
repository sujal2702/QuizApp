
import { Question } from './types';

export const DEFAULT_QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
    correctOption: 2,
    timeLimit: 15,
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctOption: 1,
    timeLimit: 15,
  },
  {
    id: 3,
    text: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
    correctOption: 1,
    timeLimit: 20,
  },
  {
    id: 4,
    text: "In React, what hook is used to manage state in a functional component?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctOption: 1,
    timeLimit: 20,
  },
  {
    id: 5,
    text: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
    correctOption: 2,
    timeLimit: 15,
  }
];
