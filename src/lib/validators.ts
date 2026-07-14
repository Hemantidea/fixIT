import { z } from "zod";

// Base question fields common to all types
const baseQuestionSchema = z.object({
  id: z.string().min(1, "Question ID must not be empty"),
  text: z.string().min(5, "Question text must be at least 5 characters long"),
  topic: z.string().min(1, "Topic must be declared"),
  subtopic: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  marks: z.number().nonnegative().optional().default(1),
  negativeMarks: z.number().nonnegative().optional().default(0),
  explanation: z.string().min(5, "Explanation text must be at least 5 characters long"),
  referenceUrl: z.string().url("Reference URL must be a valid URL structure").optional().or(z.literal("")),
});

// MCQ/MSQ Specific Validation
const selectionQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(["MCQ", "MSQ"]),
  options: z.array(z.string()).min(2, "Selection type questions must have at least 2 options"),
  correctAnswer: z.array(z.string()).min(1, "Correct answers must contain at least 1 option"),
}).refine((data) => {
  // Ensure every item in correctAnswer exists in the options array
  return data.correctAnswer.every((answer) => data.options.includes(answer));
}, {
  message: "All items in 'correctAnswer' must match one of the declared 'options'",
  path: ["correctAnswer"],
});

// Numerical Validation
const numericalQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("NUMERICAL"),
  range: z.object({
    min: z.number(),
    max: z.number(),
  }).refine((data) => data.max >= data.min, {
    message: "Range max limit cannot be less than min limit",
    path: ["max"],
  }),
});

// Discriminated union based on question type
const questionUnion = z.discriminatedUnion("type", [
  selectionQuestionSchema,
  numericalQuestionSchema,
]);

// Final full test configuration validator
export const testSchemaValidator = z.object({
  schemaVersion: z.literal("1.0.0", {
    error: "Incompatible schema format version. Expected '1.0.0'",
  }),
  testTitle: z.string().min(3, "Test title must be at least 3 characters"),
  testDescription: z.string().min(5, "Test description must be at least 5 characters"),
  testTime: z.number().int().positive("Test duration limit must be a positive integer (minutes)"),
  passingPercentage: z.number().min(1).max(100).optional().default(50),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  tags: z.array(z.string()).optional().default([]),
  questions: z.array(questionUnion).min(1, "The test configuration must contain at least one valid question"),
});

export type TestPayload = z.infer<typeof testSchemaValidator>;