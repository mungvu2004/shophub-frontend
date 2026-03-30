export interface ApiResponse<T> {
  data: T; // Source: API envelope.Data | nullable: no
  success: boolean; // Source: API envelope.Success | nullable: no
  message?: string; // Source: API envelope.Message | nullable: yes
}

export interface PaginatedResponse<T> {
  items: T[]; // Source: API envelope.Items | nullable: no
  nextCursor?: string; // Source: API envelope.NextCursor | nullable: yes
  hasMore: boolean; // Source: API envelope.HasMore | nullable: no
  totalCount?: number; // Source: API envelope.TotalCount | nullable: yes
}

export interface ApiError {
  status: number; // Source: ProblemDetails.status | nullable: no
  title: string; // Source: ProblemDetails.title | nullable: no
  detail: string; // Source: ProblemDetails.detail | nullable: no
  errors?: Record<string, string[]>; // Source: ValidationProblemDetails.errors | nullable: yes
  traceId?: string; // Source: ProblemDetails.traceId | nullable: yes
}
