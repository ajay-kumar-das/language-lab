import { AIRequest, AIResponse } from "../../../types/ai.types";

export class AnthropicService {
  private config: any;
  
  constructor(config: any) {
    this.config = config;
  }

  async generateContent(request: AIRequest): Promise<Omit<AIResponse, "processingTime" | "provider">> {
    const response = await fetch(`${this.config.baseURL}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": this.config.apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: request.model || this.config.defaultModel,
        max_tokens: request.maxTokens || 2000,
        temperature: request.temperature || 0.7,
        system: request.systemPrompt,
        messages: [
          { role: "user", content: request.prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0].text,
      model: request.model || this.config.defaultModel,
      tokenUsage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens
      },
      cost: this.calculateCost(data.usage.input_tokens, data.usage.output_tokens, request.model || this.config.defaultModel)
    };
  }

  private calculateCost(inputTokens: number, outputTokens: number, model: string): number {
    const rates = {
      "claude-3-5-sonnet-20241022": { input: 0.003, output: 0.015 }, // per 1k tokens
      "claude-3-haiku-20240307": { input: 0.00025, output: 0.00125 }
    };
    
    const rate = rates[model as keyof typeof rates] || rates["claude-3-haiku-20240307"];
    return (inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output;
  }

  async healthCheck(): Promise<void> {
    // Anthropic doesn't have a dedicated health endpoint, so we make a minimal request
    const response = await fetch(`${this.config.baseURL}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": this.config.apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 10,
        messages: [{ role: "user", content: "health" }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Anthropic health check failed: ${response.status}`);
    }
  }
}
