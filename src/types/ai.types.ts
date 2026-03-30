export interface ChatMessage {
  role: "user" | "assistant"; // Source: Chat API message role convention | nullable: no
  content: string; // Source: Chat API message content | nullable: no
  timestamp: string; // Source: Chat API message timestamp | nullable: no
}

export interface ChatRequest {
  sessionId: string; // Source: ChatSessions.Id | nullable: no
  history: ChatMessage[]; // Source: Redis session history payload | nullable: no
  currentMessage: string; // Source: Chat request body.CurrentMessage | nullable: no
  userId: string; // Source: Sellers.Id | nullable: no
  language?: "vi" | "en"; // Source: Chat request body.Language | nullable: yes
}

export interface ChatResponse {
  replyMessage: string; // Source: Chat response.ReplyMessage | nullable: no
  sessionId: string; // Source: ChatSessions.Id | nullable: no
  confidenceScore: number; // Source: Chat response.ConfidenceScore | nullable: no
  suggestedAction?: "VIEW_ORDER" | "CREATE_TICKET" | null; // Source: Chat response.SuggestedAction | nullable: yes
  followUpQuestions: string[]; // Source: Chat response.FollowUpQuestions | nullable: no
}

export interface ForecastPoint {
  date: string; // Source: ForecastResults.ResultPayload.forecast[].date | nullable: no
  predictedRevenue: number; // Source: ForecastResults.ResultPayload.forecast[].predictedRevenue | nullable: no
  lowerBound: number; // Source: ForecastResults.ResultPayload.forecast[].lowerBound | nullable: no
  upperBound: number; // Source: ForecastResults.ResultPayload.forecast[].upperBound | nullable: no
}

export interface SalesForecastResult {
  id: string; // Source: ForecastResults.Id | nullable: no
  entityType: "Product"; // Source: ForecastResults.EntityType | nullable: no
  entityId: string; // Source: ForecastResults.EntityId | nullable: no
  forecastType: "SalesRegression"; // Source: ForecastResults.ForecastType | nullable: no
  productId: string; // Source: Derived alias from EntityId | nullable: no
  forecast: ForecastPoint[]; // Source: Parsed ForecastResults.ResultPayload.forecast | nullable: no
  rSquared: number; // Source: ForecastResults.RSquared | nullable: no
  modelVersion?: string; // Source: ForecastResults.ModelVersion | nullable: yes
  insights: string[]; // Source: Parsed ForecastResults.ResultPayload.insights | nullable: no
  forecastHorizonDays?: number; // Source: ForecastResults.ForecastHorizonDays | nullable: yes
  isStale: boolean; // Source: ForecastResults.IsStale | nullable: no
  createdAt: string; // Source: ForecastResults.CreatedAt | nullable: no
  expiresAt?: string; // Source: ForecastResults.ExpiresAt | nullable: yes
}

export interface InventoryForecastResult {
  warehouseId: string; // Source: Warehouses.Id | nullable: no
  alerts: Array<{
    alertType: "LOW_STOCK" | "OUT_OF_STOCK" | "OVERSTOCK"; // Source: Forecast payload.alerts[].alertType | nullable: no
    sku: string; // Source: ProductVariants.InternalSku | nullable: no
    daysUntilStockout?: number; // Source: Forecast payload.alerts[].daysUntilStockout | nullable: yes
  }>; // Source: Forecast payload.alerts | nullable: no
  recommendedRestockDate?: string; // Source: Forecast payload.recommendedRestockDate | nullable: yes
  suggestedOrderQty: Record<string, number>; // Source: Forecast payload.suggestedOrderQty | nullable: no
  confidence: number; // Source: Forecast payload.confidence | nullable: no
}

export interface ChatSession {
  id: string; // Source: ChatSessions.Id | nullable: no
  sessionKey: string; // Source: ChatSessions.SessionKey | nullable: no
  messageCount: number; // Source: ChatSessions.MessageCount | nullable: no
  startedAt: string; // Source: ChatSessions.StartedAt | nullable: no
  lastActivityAt: string; // Source: ChatSessions.LastActivityAt | nullable: no
}
