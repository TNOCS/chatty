import m from 'mithril';
import { apiServer } from '../app';
import { IEnvironment } from '../models/environment';

class EnvironmentService {
  private baseUrl: string;
  private environment = {} as IEnvironment;

  constructor() {
    this.baseUrl = `${apiServer()}/api/env`;
  }

  public get env() {
    return this.environment;
  }

  public async getEnv() {
    this.environment = await m.request<IEnvironment>({
      method: 'GET',
      url: this.baseUrl,
    });
    if (!this.environment) {
      console.warn('No environment variables found at ' + this.baseUrl);
    }
    return this.environment;
  }
}

export const envSvc = new EnvironmentService();
