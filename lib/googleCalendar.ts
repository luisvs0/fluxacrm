
const CLIENT_ID = '819652563805-c6s39aerm32jm9iblehbl8il7c46t12l.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

interface GoogleCalendarEvent {
  summary: string;
  location?: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

class GoogleCalendarService {
  private accessToken: string | null = null;
  private tokenClient: any = null;

  constructor() {
    this.accessToken = localStorage.getItem('google_access_token');
  }

  private initTokenClient(callback: (token: string) => void) {
    if (typeof window === 'undefined' || !(window as any).google) {
      console.error('Google SDK não carregado. Verifique se o script do Google está no index.html');
      return;
    }

    // Google Identity Services Token Client
    this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      ux_mode: 'popup', // Garante que não tente redirecionar a página inteira
      callback: (response: any) => {
        if (response.access_token) {
          this.accessToken = response.access_token;
          localStorage.setItem('google_access_token', response.access_token);
          callback(response.access_token);
        }
        if (response.error) {
          console.error('Erro OAuth Google:', response.error, response.error_description);
          alert(`Erro na autenticação: ${response.error_description || response.error}`);
        }
      },
    });
  }

  connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.initTokenClient((token) => resolve(token));
        if (this.tokenClient) {
          // Solicita o token. O prompt 'consent' garante que o usuário veja a tela de permissão.
          this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          reject('SDK do Google não inicializado');
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  disconnect() {
    this.accessToken = null;
    localStorage.removeItem('google_access_token');
    if (typeof window !== 'undefined' && (window as any).google) {
      // Opcional: revogar o token no servidor do Google
      (window as any).google.accounts.oauth2.revoke(this.accessToken || '', () => {});
    }
  }

  isConnected() {
    return !!this.accessToken;
  }

  async createEvent(event: GoogleCalendarEvent) {
    if (!this.accessToken) {
      console.warn('Google Calendar não conectado. Tentando conectar...');
      return null;
    }

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (response.status === 401) {
        // Token expirado ou inválido
        this.disconnect();
        return null;
      }

      const data = await response.json();
      if (data.error) {
        console.error('Erro API Google Calendar:', data.error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar:', error);
      return null;
    }
  }
}

export const googleCalendar = new GoogleCalendarService();
