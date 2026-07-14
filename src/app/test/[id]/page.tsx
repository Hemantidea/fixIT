import React from "react";
import { prisma } from "../../../lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TestPlayer from "./test-player";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }

  const { id } = await params;

  const test = await prisma.test.findUnique({
    where: { id },
  });

  if (!test) {
    redirect("/dashboard");
  }

  // Fetch bookmarks previously stored for this user and test
  const existingBookmarks = await prisma.bookmark.findMany({
    where: {
      userId: session.user.id,
      testId: id,
    },
  });

  const parsedTest = JSON.parse(JSON.stringify(test));
  const bookmarksList = existingBookmarks.map((b) => b.questionId);

  return (
    <TestPlayer 
      test={parsedTest} 
      initialBookmarks={bookmarksList} 
    />
  );
}