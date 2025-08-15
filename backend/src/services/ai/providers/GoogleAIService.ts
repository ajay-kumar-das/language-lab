import { AIRequest, AIResponse } from "../../../types/ai.types";

export class GoogleAIService {
  private config: any;
  
  constructor(config: any) {
    this.config = config;
  }

  async generateContent(request: AIRequest): Promise<Omit<AIResponse, "processingTime" | "provider">> {
    const model = request.model || this.config.defaultModel;
    const response = await fetch(`${this.config.baseURL}/models/${model}:generateContent?key=${this.config.apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: request.systemPrompt ? `${request.systemPrompt}\n\n${request.prompt}` : request.prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: request.maxTokens || 2000,
          temperature: request.temperature || 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Google AI returned no candidates");
    }

    const candidate = data.candidates[0];
    const content = candidate.content.parts[0].text;
    
    // Google AI doesn't provide detailed token usage in the same way
    const estimatedTokens = Math.ceil(content.length / 4); // Rough estimation
    
    return {
      content,
      model,
      tokenUsage: {
        promptTokens: Math.ceil(request.prompt.length / 4),
        completionTokens: estimatedTokens,
        totalTokens: Math.ceil(request.prompt.length / 4) + estimatedTokens
      },
      cost: this.calculateCost(estimatedTokens, model)
    };
  }

  private calculateCost(tokens: number, model: string): number {
    const rates = {
      "gemini-1.5-pro": { rate: 0.0035 }, // per 1k tokens (simplified)
      "gemini-1.5-flash": { rate: 0.00035 }
    };
    
    const rate = rates[model as keyof typeof rates] || rates["gemini-1.5-flash"];
    return (tokens / 1000) * rate.rate;
  }

  async healthCheck(): Promise<void> {
    const response = await fetch(`${this.config.baseURL}/models?key=${this.config.apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Google AI health check failed: ${response.status}`);
    }
  }
}
