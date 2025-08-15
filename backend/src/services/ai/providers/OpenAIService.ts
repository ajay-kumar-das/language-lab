import { AIRequest, AIResponse } from "../../../types/ai.types";

export class OpenAIService {
  private config: any;
  
  constructor(config: any) {
    this.config = config;
  }

  async generateContent(request: AIRequest): Promise<Omit<AIResponse, "processingTime" | "provider">> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: request.model || this.config.defaultModel,
        messages: [
          ...(request.systemPrompt ? [{ role: "system", content: request.systemPrompt }] : []),
          { role: "user", content: request.prompt }
        ],
        max_tokens: request.maxTokens || 2000,
        temperature: request.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: request.model || this.config.defaultModel,
      tokenUsage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      },
      cost: this.calculateCost(data.usage.total_tokens, request.model || this.config.defaultModel)
    };
  }

  private calculateCost(tokens: number, model: string): number {
    const rates = {
      "gpt-4o": { input: 0.005, output: 0.015 }, // per 1k tokens
      "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
      "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 }
    };
    
    const rate = rates[model as keyof typeof rates] || rates["gpt-4o-mini"];
    return (tokens / 1000) * rate.output; // Simplified calculation
  }

  async healthCheck(): Promise<void> {
    const response = await fetch(`${this.config.baseURL}/models`, {
      headers: { "Authorization": `Bearer ${this.config.apiKey}` }
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI health check failed: ${response.status}`);
    }
  }
}
