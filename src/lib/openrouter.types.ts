import { z } from "zod";

// Configuration types
export interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
}

// Request types
export interface ModelParams {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export interface JSONSchema {
  name: string;
  strict: boolean;
  schema: Record<string, unknown>;
}

export interface ResponseFormat {
  type: "json_schema";
  json_schema: JSONSchema;
}

export interface SendMessageOptions {
  systemMessage: string;
  userMessage: string;
  responseFormat: ResponseFormat;
  modelName: string;
  modelParams?: ModelParams;
}

export interface OpenRouterMessage {
  role: "system" | "user";
  content: string;
}

export interface OpenRouterRequest {
  messages: OpenRouterMessage[];
  model: string;
  response_format: ResponseFormat;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

// Response types
export interface ChatResponse<T> {
  data: T;
  raw: unknown;
}

// Error types
export class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter?: number
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors?: z.ZodError
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class FormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormatError";
  }
}

// OpenRouter API Response types
export interface OpenRouterChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: OpenRouterChoice[];
  model: string;
  created: number;
}

// Zod Schemas for validation
export const openRouterMessageSchema = z.object({
  role: z.string(),
  content: z.string(),
});

export const openRouterChoiceSchema = z.object({
  message: openRouterMessageSchema,
  finish_reason: z.string(),
});

export const openRouterResponseSchema = z.object({
  id: z.string(),
  choices: z.array(openRouterChoiceSchema),
  model: z.string(),
  created: z.number(),
});
