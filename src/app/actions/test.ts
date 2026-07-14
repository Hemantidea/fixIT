"use server";

import { prisma } from "../../lib/db";
import { testSchemaValidator } from "../../lib/validators";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export async function saveTest(jsonString: string) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Access denied. Please authenticate.");
  }

  try {
    const parsedData = JSON.parse(jsonString);
    const validatedData = testSchemaValidator.parse(parsedData);

    const test = await prisma.test.create({
      data: {
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
    if (error.name === "ZodError") {
      const errors = error.errors.map((e: any) => `${e.path.join(".")}: ${e.message}`).join("\n");
      return { success: false, error: `Schema Validation Error:\n${errors}` };
    }
    return { success: false, error: error.message || "An unknown database error occurred." };
  }
}

export async function getTests() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Access denied. Please authenticate.");
  }

  // Fetch tests with attempts linked specifically to the logged-in user
  return await prisma.test.findMany({
    include: {
      attempts: {
        where: { userId: session.user.id },
        orderBy: { completedAt: "desc" },
        select: {
          id: true,
          score: true,
          timeSpent: true,
          completedAt: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}