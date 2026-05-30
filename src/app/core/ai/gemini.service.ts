import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { GEMINI_API_KEY } from './gemini-api-key';

type GeminiPart = {
  text: string;
};

type GeminiContent = {
  parts?: GeminiPart[];
};

type GeminiResponse = {
  candidates?: Array<{
    content?: GeminiContent;
  }>;
  error?: {
    message?: string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly http = inject(HttpClient);
  private readonly model = 'gemini-2.5-flash';
  private readonly endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

  async ask(prompt: string): Promise<string> {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      return 'Enter a business question to prepare an AI summary.';
    }

    try {
      const response = await firstValueFrom(
        this.http.post<GeminiResponse>(
          this.endpoint,
          {
            systemInstruction: {
              parts: [
                {
                  text: [
                    'Your name is Aira. You are the AI assistant inside the RBS Chemical business workspace. If asked who you are, introduce yourself as Aira.',
                    'Answer only for ERP/business workflows related to customers, regions, invoices, quotations, products, payments, reports, account follow-ups, and collections.',
                    'Keep answers concise, practical, and action-oriented. When data is not available in the current app context, say what data is needed instead of inventing values.',
                  ].join(' '),
                },
              ],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: cleanPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topP: 0.9,
              maxOutputTokens: 700,
            },
          },
          {
            headers: {
              'x-goog-api-key': GEMINI_API_KEY,
            },
          },
        ),
      );

      return this.extractText(response);
    } catch (error) {
      return this.formatError(error);
    }
  }

  private extractText(response: GeminiResponse): string {
    const text = response.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    return text || 'Gemini did not return a response. Try asking the question another way.';
  }

  private formatError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = (error.error as GeminiResponse | undefined)?.error?.message;

      if (error.status === 0) {
        return 'Unable to reach Gemini from the browser. Check the internet connection or API access settings.';
      }

      return message
        ? `Gemini request failed: ${message}`
        : `Gemini request failed with status ${error.status}.`;
    }

    return 'Gemini request failed. Please try again.';
  }
}
