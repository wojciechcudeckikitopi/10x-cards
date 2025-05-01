# REST API Plan

## 1. Resources

- **Users**: Represents application users. (Database: `users` table managed by Supabase Auth)
- **Flashcards**: Study cards containing a front (max 200 characters) and a back (max 500 characters). (Database: `flashcards` table)
- **Generations**: Records for AI-driven flashcard generation requests. Contains metadata such as source text hash, text length, count of generated flashcards, and processing duration. (Database: `generations` table)
- **Generation Errors**: Logs any errors encountered during the flashcard generation process. (Database: `generation_errors` table)

## 2. Endpoints

### B. Flashcards

Endpoints for creating, retrieving, updating, and deleting flashcards. Supports both manually created and AI-generated flashcards.

- **GET /flashcards**
  - Description: Retrieve a list of flashcards for the authenticated user.
  - Query Parameters: 
    - `page` (optional, default 1)
    - `limit` (optional, default 20)
    - `status` (optional: pending, accepted, rejected)
    - `sort_by` (optional: created_at, updated_at)
  - Success Response (200):
    ```json
    {
      "data": [
        {
          "id": 1,
          "front": "...",
          "back": "...",
          "status": "pending",
          "source": "ai",
          "generation_id": "...",
          "created_at": "2023-01-01T12:00:00Z",
          "updated_at": "2023-01-01T12:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100
      }
    }
    ```
  - Errors: 401 Unauthorized

- **GET /flashcards/:id**
  - Description: Retrieve detailed information for a specific flashcard.
  - Success Response (200):
    ```json
    {
      "id": 1,
      "front": "...",
      "back": "...",
      "status": "pending",
      "source": "ai",
      "generation_id": "...",
      "created_at": "2023-01-01T12:00:00Z",
      "updated_at": "2023-01-01T12:00:00Z"
    }
    ```
  - Errors: 401 Unauthorized, 404 Not Found

- **POST /flashcards**
  - Description: Create one or more flashcards. This endpoint supports creating flashcards manually as well as AI-generated flashcards (both "ai" and "ai-edited"). Multiple flashcards can be submitted in a single request.
  - Request Payload:
    ```json
    {
      "flashcards": [
        {
          "front": "Text for the front (max 200 characters)",
          "back": "Text for the back (max 500 characters)",
          "source": "manual", // allowed values: "manual", "ai", "ai-edited"
          "generation_id": "optional-generation-id"  // included if related to an AI generation
        }
      ]
    }
    ```
  - Validation: Ensure each flashcard's `front` text does not exceed 200 characters, `back` text does not exceed 500 characters, and `source` is one of "manual", "ai", or "ai-edited". Validate `generation_id` if provided.
  - Success Response (201): Returns the created flashcards with assigned ids and timestamps.
  - Errors: 400 Bad Request (if payload or length validation fails), 401 Unauthorized

- **PUT /flashcards/:id**
  - Description: Update an existing flashcard (editing front/back text or status).
  - Request Payload (any of the following fields):
    ```json
    {
      "front": "Updated text (max 200 characters)",
      "back": "Updated text (max 500 characters)",
      "status": "accepted" // or "rejected", applicable to AI-generated flashcards
    }
    ```
  - Validation: Check that if provided, `front` does not exceed 200 characters, `back` does not exceed 500 characters, and `status` (if provided) is either "accepted" or "rejected".
  - Success Response (200): Updated flashcard.
  - Errors: 400 Bad Request, 401 Unauthorized, 404 Not Found

- **DELETE /flashcards/:id**
  - Description: Delete a flashcard by its id.
  - Success Response (200): Message confirming deletion.
  - Errors: 401 Unauthorized, 404 Not Found

### C. Generations

Endpoints to handle AI-generated flashcard processes.

- **POST /generations**
  - Description: Initiate flashcard generation by providing source text for AI processing.
  - Request Payload:
    ```json
    {
      "source_text": "Text input between 1000 and 10000 characters"
    }
    ```
  - Validation: Ensure the `source_text` length is between 1000 and 10,000 characters.
  - Success Response (201): New generation record with details such as generation ID, generated_count, and initial flashcards with status set to "pending".
  - Errors: 400 Bad Request, 401 Unauthorized

- **GET /generations**
  - Description: Retrieve a list of generation requests for the authenticated user.
  - Query Parameters: 
    - `page`, `limit`, and optionally filter by date or llm_model.
  - Success Response (200):
    ```json
    {
      "data": [
        {
          "id": 10,
          "source_text_hash": "...",
          "source_text_length": 1500,
          "generated_count": 5,
          "accepted_unedited_count": 3,
          "accepted_edited_count": 1,
          "llm_model": "gpt-4",
          "generation_duration": 120,
          "generated_at": "2023-01-01T12:00:00Z",
          "updated_at": "2023-01-01T12:05:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 50
      }
    }
    ```
  - Errors: 401 Unauthorized

- **GET /generations/:id**
  - Description: Retrieve details for a specific generation request.
  - Success Response (200): Generation record details (see above).
  - Errors: 401 Unauthorized, 404 Not Found

### D. Generation Errors

Endpoints to retrieve error logs related to flashcard generation.

- **GET /generation-errors**
  - Description: List generation error records for the authenticated user.
  - Query Parameters: `page`, `limit`
  - Success Response (200):
    ```json
    {
      "data": [
        {
          "id": 5,
          "source_text_hash": "...",
          "source_text_length": 1500,
          "error_message": "Error details",
          "llm_model": "gpt-4",
          "created_at": "2023-01-01T12:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 5
      }
    }
    ```
  - Errors: 401 Unauthorized


## 3. Authentication and Authorization

- **Authentication**: All endpoints (except public or initial auth endpoints managed by Supabase) require a valid JWT provided via the `Authorization` header.
- **Authorization**: Row-Level Security (RLS) in the database ensures that users can only access their own records. Endpoints will enforce this by validating the user context (e.g., using the `current_setting('app.current_user_id')` in PostgreSQL policies).
- **Third-Party Auth**: User registration, login, and password reset are handled by Supabase Auth, and these endpoints are not re-implemented in the API.

## 4. Validation and Business Logic

- **Validation Rules**:
  - **Flashcards**: Ensure that the `front` text does not exceed 200 characters and the `back` text does not exceed 500 characters.
  - **Generations**: Validate that the provided `source_text` length is between 1000 and 10,000 characters.
  - Input data must be sanitized and validated to prevent SQL injection and other security issues.