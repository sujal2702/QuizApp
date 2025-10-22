# Admin Quiz Workflow

## Complete Step-by-Step Flow

### 1. CREATE ROOM (Admin Dashboard)
- Admin fills in quiz name
- Selects mode (Option-Only or Full Manual+AI)
- Sets number of questions
- Configures each question (answers, time limits)
- Clicks "🚀 Create Room" button
- **Action**: Room created in Firebase + Local state
- **Navigate to**: Lobby Screen

### 2. LOBBY (Waiting Screen)
- **Shows**: 
  - Room Code (for students to join)
  - Quiz Name
  - List of joined participants
  - "Start Quiz" button (disabled until at least 1 student joins)
- **Admin waits for students** to join using the room code
- **When ready**: Admin clicks "🚀 Start Quiz"
- **Navigate to**: Quiz Screen (status changes to 'active')

### 3. QUIZ SCREEN (Admin Control Panel)
Admin has full control with these buttons:

#### For Each Question:
1. **▶️ Open ({time}s)** - Opens question for student answers
   - Sets `acceptingAnswers = true`
   - Starts timer for students
   - Students can now submit answers

2. **⏸️ Close** - Stops accepting answers
   - Sets `acceptingAnswers = false`
   - Students can no longer answer

3. **👁️ Reveal** - Shows correct answer
   - Sets `answersRevealed = true`
   - Highlights correct answer on admin screen
   - Shows correct answer to students (if implemented)

4. **📊 Results** - View live leaderboard anytime
   - Navigate to Results Screen
   - Shows current standings
   - Can return to Quiz Control

5. **⏭️ Next** - Move to next question
   - Closes current question
   - Resets answer accepting state
   - Increments question index
   - If last question: Shows "🏁 End" instead

#### Admin sees:
- Current question with all 4 colored options (A/B/C/D)
- Which answer is correct (highlighted when revealed)
- Response count: "X / Y students answered"
- Progress bar

### 4. STUDENT FLOW (Parallel)

#### Join:
- Student enters room code on Student Join screen
- Student added to room.students array
- Appears in Lobby participant list

#### During Quiz:
- Sees colored option buttons (Red ●, Yellow ■, Green ▲, Blue ★)
- Can only answer when admin clicks "Open"
- Timer counts down
- After answering: "✓ Answer Submitted!" message
- Waits for next question

### 5. RESULTS SCREEN (Final)

#### Shows:
- **Live Leaderboard** while quiz is ongoing
- **Final Results** when quiz ends
- Each student's:
  - Rank (#1, #2, #3...)
  - Total score (10 points per correct answer)
  - Total time taken

#### Detailed View:
- Click any student to expand
- See question-by-question breakdown:
  - ✔️ Correct / ❌ Incorrect
  - Time taken per question
  - "Not Answered" if no response

#### Scoring:
- +10 points for each correct answer
- 0 points for incorrect/no answer
- Ranked by: Score (descending) → Time (ascending)

### 6. MARKS & DASHBOARD UPDATE

The system updates live:
- **Responses array** tracks every answer submission
- **Scores calculated** on-the-fly in Results Screen
- **Firebase updates** in real-time for all connected clients
- **Leaderboard refreshes** as students answer

## Button Flow Summary

```
Admin Dashboard
   ↓ Create Room
Lobby (Waiting)
   ↓ Start Quiz
Quiz Screen (Question 1)
   ↓ Open → Close → Reveal → Next
Quiz Screen (Question 2)
   ↓ Open → Close → Reveal → Next
   ...
Quiz Screen (Last Question)
   ↓ Open → Close → Reveal → End
Results Screen (Final)
```

## Key States

### QuizRoom.status:
- `'waiting'` - In lobby
- `'active'` - Quiz in progress
- `'ended'` - Quiz finished

### During Active Quiz:
- `acceptingAnswers` - true/false (controlled by Open/Close)
- `answersRevealed` - true/false (controlled by Reveal)
- `currentQuestionIndex` - tracks which question (0-based)

## Firebase Structure

```
/rooms/{roomId}
  ├─ id
  ├─ name
  ├─ code
  ├─ mode
  ├─ status
  ├─ currentQuestionIndex
  ├─ acceptingAnswers
  ├─ answersRevealed
  ├─ questions[]
  ├─ students[]
  └─ responses[]
      └─ {responseId}
          ├─ studentId
          ├─ questionId
          ├─ selectedOption
          ├─ timeTaken
          └─ isCorrect
```
