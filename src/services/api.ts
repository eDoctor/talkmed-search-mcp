import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { SearchRequest, SearchResponse } from '../types/index.js';

export class TalkMEDAPI {
  private client: AxiosInstance;
  private readonly baseURL = 'https://apiportal.talkmed.com';
  private readonly searchEndpoint = '/v1/pc/search';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TalkMED-Search-CLI/1.0.0'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔍 正在搜索: ${config.params?.word || '未知关键词'}`);
        return config;
      },
      (error) => {
        console.error('请求配置错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          // 服务器响应错误
          console.error(`API 错误 ${error.response.status}: ${error.response.statusText}`);
          if (error.response.data?.message) {
            console.error('错误详情:', error.response.data.message);
          }
        } else if (error.request) {
          // 网络错误
          console.error('网络连接失败，请检查网络连接');
        } else {
          // 其他错误
          console.error('请求失败:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 执行搜索请求
   * @param searchRequest 搜索请求参数
   * @returns 搜索响应数据
   */
  public async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    try {
      const params = {
        word: searchRequest.word,
        ...(searchRequest.type && searchRequest.type !== 'all' && { type: searchRequest.type }),
        ...(searchRequest.page && searchRequest.page > 1 && { page: searchRequest.page })
      };

      const response: AxiosResponse<SearchResponse> = await this.client.get(
        this.searchEndpoint,
        { params }
      );

      if (response.data.code !== 0) {
        throw new Error(`API 返回错误代码: ${response.data.code}`);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('请求超时，请稍后重试');
        }
        if (error.code === 'ENOTFOUND') {
          throw new Error('无法连接到 TalkMED 服务器，请检查网络连接');
        }
      }
      throw error;
    }
  }

  /**
   * 验证 API 连接
   * @returns 连接状态
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.search({ word: 'test', page: 1 });
      return true;
    } catch (error) {
      console.error('API 连接测试失败:', error instanceof Error ? error.message : '未知错误');
      return false;
    }
  }

  /**
   * 获取 API 基础信息
   */
  public getAPIInfo(): { baseURL: string; endpoint: string } {
    return {
      baseURL: this.baseURL,
      endpoint: this.searchEndpoint
    };
  }
}