export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private getAuthHeader(): Record<string, string> {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Essayer de parser l'erreur en JSON, sinon prendre le texte brut
      let errorMessage = response.statusText;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message ?? errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
      } catch (e) {
        // ignore
      }
      throw new Error(errorMessage);
    }

    // Pour les réponses 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Vérifier que la réponse est bien du JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(
        "La réponse du serveur n'est pas du JSON valide :\n" + text.slice(0, 200)
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(this.baseUrl + endpoint);

    // Ajouter les paramètres de requête
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: "PUT",
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: "PATCH",
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: "DELETE",
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse<T>(response);
  }

  // Méthode pour télécharger un fichier
  async downloadFile(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<Blob> {
    const url = new URL(this.baseUrl + endpoint);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message ?? response.statusText;
      throw new Error(errorMessage);
    }

    return response.blob();
  }

  // Méthode pour uploader un fichier
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await fetch(this.baseUrl + endpoint, {
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
      },
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

// Exporter une instance singleton du service
export const apiService = new ApiService();
