// Types for Ollama API responses
export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

// API Response types for our Next.js endpoints
export interface ModelsApiResponse {
  success: true;
  models: OllamaModel[];
}

export interface ModelsApiError {
  success: false;
  error: string;
}

export type ModelsApiResult = ModelsApiResponse | ModelsApiError;

// Type guard to check if response is successful
export function isModelsApiSuccess(
  response: ModelsApiResult
): response is ModelsApiResponse {
  return response.success === true;
}