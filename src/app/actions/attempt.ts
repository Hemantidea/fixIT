"use server";

import { prisma } from "../../lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

interface QuestionResponse {
  questionId: string;
  selected: string[]; // Options chosen (MCQ/MSQ) or single string array for Numerical
  timeSpent: number;  // Seconds spent on this question
}

export async function submitTestAttempt(
  testId: string,
  responses: QuestionResponse[],
  totalTimeSpent: number,
  bookmarks: string[]
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Access denied. Please authenticate.");
  }

  const userId = session.user.id;

  // 1. Fetch the raw test data
  const test = await prisma.test.findUnique({
    where: { id: testId },
  });

  if (!test) {
    throw new Error("Assessment not found.");
  }

  const testData = test.rawJson as any;
  const questions = testData.questions || [];

  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  // 2. Evaluate each question
  const questionAttemptsData = questions.map((q: any) => {
    const userResp = responses.find((r) => r.questionId === q.id);
    const selectedAnswers = userResp ? userResp.selected : [];
    const timeSpentOnQuestion = userResp ? userResp.timeSpent : 0;

    let isCorrect = false;
    const isAttempted = selectedAnswers.length > 0;

    if (isAttempted) {
      if (q.type === "MCQ") {
        // Single option match
        isCorrect = selectedAnswers[0] === q.correctAnswer[0];
      } else if (q.type === "MSQ") {
        // Exact arrays match regardless of order
        const correctAnswersList = q.correctAnswer || [];
        isCorrect =
          selectedAnswers.length === correctAnswersList.length &&
          selectedAnswers.every((val) => correctAnswersList.includes(val));
      } else if (q.type === "NUMERICAL") {
        // Evaluate float range
        const numericValue = parseFloat(selectedAnswers[0]);
        if (!isNaN(numericValue) && q.range) {
          isCorrect = numericValue >= q.range.min && numericValue <= q.range.max;
        }
      }

      const questionMarks = q.marks ?? 1;
      const questionNegative = q.negativeMarks ?? 0;

      if (isCorrect) {
        totalScore += questionMarks;
        correctCount++;
      } else {
        totalScore -= questionNegative;
        incorrectCount++;
      }
    }

    return {
      questionId: q.id,
      selected: selectedAnswers as any,
      timeSpent: timeSpentOnQuestion,
      isCorrect,
      isBookmarked: bookmarks.includes(q.id),
    };
  });

  // 3. Database transaction to record results
  const attempt = await prisma.$transaction(async (tx) => {
    // Save structural attempt
    const attemptRecord = await tx.attempt.create({
      data: {
        testId,
        userId,
        score: parseFloat(totalScore.toFixed(2)),
        totalQuestions: questions.length,
        correctCount,
        incorrectCount,
        timeSpent: totalTimeSpent,
        responses: {
          create: questionAttemptsData.map((qa: any) => ({
            questionId: qa.questionId,
            selected: qa.selected,
            timeSpent: qa.timeSpent,
            isCorrect: qa.isCorrect,
            isBookmarked: qa.isBookmarked,
          })),
        },
      },
    });

    // Sync persistent bookmarks
    await tx.bookmark.deleteMany({
      where: { userId, testId },
    });

    if (bookmarks.length > 0) {
      await tx.bookmark.createMany({
        data: bookmarks.map((qId) => ({
          userId,
          testId,
          questionId: qId,
        })),
      });
    }

    return attemptRecord;
  });

  revalidatePath("/dashboard");
  return { success: true, attemptId: attempt.id };
}