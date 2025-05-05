import { z } from "zod";
import type { ChatResponse, OpenRouterConfig, OpenRouterRequest, SendMessageOptions } from "./openrouter.types";
import {
  APIError,
  AuthError,
  FormatError,
  NetworkError,
  RateLimitError,
  ValidationError,
  openRouterResponseSchema,
} from "./openrouter.types";

export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor(config: OpenRouterConfig) {
    if (!config.apiKey) {
      throw new Error("OpenRouter API key is required");
    }
    if (!config.baseURL) {
      throw new Error("OpenRouter base URL is required");
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL.replace(/\/$/, ""); // Remove trailing slash if present
  }

  /**
   * Sends a message to OpenRouter API and returns a structured response
   * @template T - The expected response data type
   * @param options - Message options including system message, user message, and model parameters
   * @returns Promise with the structured response
   * @throws {NetworkError} On network issues
   * @throws {AuthError} On authentication failures
   * @throws {RateLimitError} When rate limit is exceeded
   * @throws {APIError} On API errors
   * @throws {ValidationError} When response doesn't match expected schema
   * @throws {FormatError} On unsupported response formats
   */
  public async sendMessage<T>(options: SendMessageOptions): Promise<ChatResponse<T>> {
    const payload = this.buildPayload(options);
    const response = await this.fetchAPI(payload);
    return this.processResponse<T>(response, options.responseFormat.json_schema.schema);
  }

  private buildPayload(options: SendMessageOptions): OpenRouterRequest {
    return {
      messages: [
        { role: "system", content: options.systemMessage },
        { role: "user", content: options.userMessage },
      ],
      model: options.modelName,
      response_format: options.responseFormat,
      ...(options.modelParams && {
        temperature: options.modelParams.temperature,
        max_tokens: options.modelParams.max_tokens,
        top_p: options.modelParams.top_p,
      }),
    };
  }

  private async fetchAPI(payload: OpenRouterRequest): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
          "X-Title": "10x-cards-project", // Required by OpenRouter
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      if (
        error instanceof NetworkError ||
        error instanceof AuthError ||
        error instanceof RateLimitError ||
        error instanceof APIError
      ) {
        throw error;
      }
      throw new NetworkError("Failed to communicate with OpenRouter API", error as Error);
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));

    switch (response.status) {
      case 401:
        throw new AuthError("Invalid API key or unauthorized access");
      case 429:
        throw new RateLimitError("Rate limit exceeded", parseInt(response.headers.get("retry-after") || "60", 10));
      case 500:
      case 502:
      case 503:
      case 504:
        throw new APIError(`Server error: ${errorData.error}`, response.status);
      default:
        throw new APIError(`API error: ${errorData.error}`, response.status);
    }
  }

  private async processResponse<T>(response: unknown, schema: Record<string, unknown>): Promise<ChatResponse<T>> {
    try {
      // First validate the OpenRouter API response structure
      const validatedResponse = openRouterResponseSchema.parse(response);

      // Extract the content from the first choice
      if (!validatedResponse.choices.length) {
        throw new FormatError("No response choices available");
      }

      const content = validatedResponse.choices[0].message.content;

      try {
        // Parse the content as JSON since it should be a JSON string
        const parsedContent = JSON.parse(content);

        // Create a Zod schema from the provided JSON schema
        const dynamicSchema = z.object(this.convertJsonSchemaToZod(schema));

        // Validate the parsed content against the dynamic schema
        const validatedContent = dynamicSchema.parse(parsedContent);

        return {
          data: validatedContent as T,
          raw: validatedResponse,
        };
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw new FormatError("Invalid JSON in response content");
        }
        throw parseError;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Response validation failed", error);
      }
      if (error instanceof FormatError) {
        throw error;
      }
      throw new FormatError("Failed to process response format");
    }
  }

  private convertJsonSchemaToZod(schema: Record<string, unknown>): Record<string, z.ZodType> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const convertSchema = (schemaNode: any): z.ZodType => {
      if (typeof schemaNode !== "object" || !schemaNode) {
        return z.unknown();
      }

      switch (schemaNode.type) {
        case "string":
          return z.string();
        case "number":
          return z.number();
        case "boolean":
          return z.boolean();
        case "array":
          if (schemaNode.items) {
            return z.array(convertSchema(schemaNode.items));
          }
          return z.array(z.unknown());
        case "object": {
          const shape: Record<string, z.ZodType> = {};

          if (schemaNode.properties) {
            for (const [key, value] of Object.entries(schemaNode.properties)) {
              shape[key] = convertSchema(value);
            }
          }

          let zodObject = z.object(shape);

          if (schemaNode.required && Array.isArray(schemaNode.required)) {
            const required = schemaNode.required as string[];
            zodObject = zodObject.required();

            // Reset optional status for non-required fields
            const shapeWithOptional: Record<string, z.ZodType> = {};
            for (const [key, value] of Object.entries(shape)) {
              shapeWithOptional[key] = required.includes(key) ? value : value.optional();
            }
            zodObject = z.object(shapeWithOptional);
          }

          if (schemaNode.additionalProperties === false) {
            zodObject = zodObject.strip();
          }

          return zodObject;
        }
        default:
          return z.unknown();
      }
    };

    const properties = schema.properties || schema;
    return Object.entries(properties).reduce(
      (acc, [key, value]) => {
        acc[key] = convertSchema(value);
        return acc;
      },
      {} as Record<string, z.ZodType>
    );
  }
}
