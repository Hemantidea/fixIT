import React from "react";
import { prisma } from "../../../../lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ResultsClient from "./results-client";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function ResultsPage({ params }: PageProps) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }

  const { attemptId } = await params;

  // 1. Fetch current attempt details
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      test: true,
      responses: true,
    },
  });

  if (!attempt || attempt.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // 2. Fetch all historical attempts for this specific test by this user
  const historicalAttempts = await prisma.attempt.findMany({
    where: {
      testId: attempt.testId,
      userId: session.user.id,
    },
    orderBy: {
      completedAt: "asc", // Oldest to newest to build progress timeline
    },
    select: {
      id: true,
      score: true,
      timeSpent: true,
      completedAt: true,
    },
  });

  const parsedAttempt = JSON.parse(JSON.stringify(attempt));
  const parsedHistory = JSON.parse(JSON.stringify(historicalAttempts));

  return (
    <ResultsClient 
      attempt={parsedAttempt} 
      history={parsedHistory}
    />
  );
}