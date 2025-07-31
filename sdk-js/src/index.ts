// src/opal.ts
import axios, {AxiosInstance} from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
}

export class Opal {
  private client: AxiosInstance;
  public user: User | undefined;

  constructor(config: { apiKey: string; apiUrl: string }) {
    this.client = axios.create({
      // baseURL: `https://${config.orgSlug}.getopal.dev`,
      baseURL: config.apiUrl,
      headers: {
        'X-Api-Key': `${config.apiKey}`,
        'Content-Type': 'application/json'
      },
    });
  }

  async authenticate(email: string, password: string) {
    const response = await this.client.post('/auth', {
      email,
      password,
    });

    if (response.data.is_authenticated) {
      this.client.defaults.headers.common['Authorization'] = response.headers['authorization']
      this.user = await this.getUser()
    }
    return response.data;
  }

  private async getUser() {
    const response = await this.client.get('/auth/user');
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    this.user = undefined
    return response.data;
  }
}
