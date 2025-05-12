import { http, HttpResponse } from "msw";
import type { FlashcardDTO, FlashcardSource, FlashcardStatus, PaginatedResponse } from "../../types";

// Define mock data based on actual application types
const mockFlashcards: FlashcardDTO[] = [
  {
    id: "1",
    front: "What is React?",
    back: "A JavaScript library for building user interfaces",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "accepted" as FlashcardStatus,
    source: "manual" as FlashcardSource,
    generation_id: null,
  },
  {
    id: "2",
    front: "What is TypeScript?",
    back: "A typed superset of JavaScript that compiles to plain JavaScript",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "accepted" as FlashcardStatus,
    source: "manual" as FlashcardSource,
    generation_id: null,
  },
];

// Define your API handlers here
export const handlers = [
  // GET /api/flashcards with pagination
  http.get("/api/flashcards", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status") as FlashcardStatus | null;

    // Filter by status if provided
    let filtered = [...mockFlashcards];
    if (status) {
      filtered = filtered.filter((card) => card.status === status);
    }

    // Calculate pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, total);
    const data = filtered.slice(start, end);

    const response: PaginatedResponse<FlashcardDTO> = {
      data,
      pagination: {
        page,
        limit,
        total,
      },
    };

    return HttpResponse.json(response);
  }),

  // GET /api/flashcards/:id
  http.get("/api/flashcards/:id", ({ params }) => {
    const { id } = params;
    const flashcard = mockFlashcards.find((card) => card.id === id);

    if (!flashcard) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(flashcard);
  }),

  // POST /api/flashcards
  http.post("/api/flashcards", async ({ request }) => {
    const data = await request.json();

    if (data.flashcards && Array.isArray(data.flashcards)) {
      const newFlashcards = data.flashcards.map((card, index) => ({
        id: String(mockFlashcards.length + index + 1),
        front: card.front,
        back: card.back,
        status: card.status || "pending",
        source: card.source || "manual",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        generation_id: card.generation_id || null,
      }));

      return HttpResponse.json(newFlashcards, { status: 201 });
    }

    return new HttpResponse(null, { status: 400 });
  }),
];
