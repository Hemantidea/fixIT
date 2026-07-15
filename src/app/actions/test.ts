"use server";

import { prisma } from "../../lib/db";
import { testSchemaValidator } from "../../lib/validators";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export async function saveTest(jsonString: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Access denied. Please authenticate.");
  }

  try {
    const parsedData = JSON.parse(jsonString);
    const validatedData = testSchemaValidator.parse(parsedData);

    // Save into Neon database, explicitly mapping the active user as the owner
    const test = await prisma.test.create({
      data: {
        userId: session.user.id, // Links this test strictly to the creator's UUID
        title: validatedData.testTitle,
        description: validatedData.testDescription,
        timeLimit: validatedData.testTime,
        schemaVersion: validatedData.schemaVersion,
        rawJson: validatedData as any,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, testId: test.id };
  } catch (error: any) {
    const validationIssues = error?.issues || error?.errors;

    if (Array.isArray(validationIssues)) {
      const errorsList = validationIssues
        .map((e: any) => `${e.path.join(".")}: ${e.message}`)
        .join("\n");
        
      return { success: false, error: `Schema Validation Error:\n${errorsList}` };
    }
    
    return { success: false, error: error.message || "An unknown database error occurred." };
  }
}

export async function getTests() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Access denied. Please authenticate.");
  }

  // 1. Fetch only tests owned by this user (Bypasses the nested 'include' compiler bug in Prisma v7 + Neon Adapter)
  const tests = await prisma.test.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch all attempts separately for the same user
  const attempts = await prisma.attempt.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
    select: {
      id: true,
      testId: true, // Selected so we can associate in-memory
      score: true,
      timeSpent: true,
      completedAt: true,
    }
  });

  // 3. Map them together in memory (Preserves the exact relational structure your UI expects)
  return tests.map((test) => ({
    ...test,
    attempts: attempts.filter((attempt) => attempt.testId === test.id),
  }));
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}