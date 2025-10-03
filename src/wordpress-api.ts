import axios, { AxiosInstance, AxiosResponse } from 'axios';
import FormData from 'form-data';

export interface WordPressConfig {
  url: string;
  username: string;
  password?: string;
  applicationPassword?: string;
}

export interface WordPressPost {
  id?: number;
  title: string;
  content: string;
  excerpt?: string;
  status?: 'publish' | 'draft' | 'private' | 'pending';
  slug?: string;
  categories?: number[];
  tags?: number[];
  featured_media?: number;
  author?: number;
  date?: string;
  date_gmt?: string;
  modified?: string;
  modified_gmt?: string;
  format?: string;
  meta?: Record<string, any>;
  sticky?: boolean;
  template?: string;
  password?: string;
  comment_status?: 'open' | 'closed';
  ping_status?: 'open' | 'closed';
}

export interface WordPressPage {
  id?: number;
  title: string;
  content: string;
  excerpt?: string;
  status?: 'publish' | 'draft' | 'private' | 'pending';
  slug?: string;
  parent?: number;
  menu_order?: number;
  featured_media?: number;
  author?: number;
  date?: string;
  date_gmt?: string;
  modified?: string;
  modified_gmt?: string;
  template?: string;
  meta?: Record<string, any>;
  password?: string;
  comment_status?: 'open' | 'closed';
  ping_status?: 'open' | 'closed';
}

export interface WordPressMedia {
  id?: number;
  title: string;
  alt_text?: string;
  caption?: string;
  description?: string;
  media_type?: 'image' | 'video' | 'audio' | 'application';
  mime_type?: string;
  source_url?: string;
  media_details?: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: Record<string, any>;
  };
  date?: string;
  date_gmt?: string;
  modified?: string;
  modified_gmt?: string;
  slug?: string;
  status?: 'inherit' | 'private' | 'trash';
  author?: number;
  parent?: number;
  link?: string;
}

export interface WordPressUser {
  id?: number;
  username: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  url?: string;
  description?: string;
  link?: string;
  locale?: string;
  nickname?: string;
  slug?: string;
  registered_date?: string;
  roles?: string[];
  password?: string;
  capabilities?: Record<string, boolean>;
  extra_capabilities?: Record<string, boolean>;
  avatar_urls?: Record<string, string>;
  meta?: Record<string, any>;
}

export interface WordPressCategory {
  id?: number;
  count?: number;
  description?: string;
  link?: string;
  name: string;
  slug?: string;
  taxonomy?: string;
  parent?: number;
  meta?: Record<string, any>;
}

export interface WordPressTag {
  id?: number;
  count?: number;
  description?: string;
  link?: string;
  name: string;
  slug?: string;
  taxonomy?: string;
  meta?: Record<string, any>;
}

export class WordPressAPI {
  private client: AxiosInstance;
  private config: WordPressConfig;

  constructor(config: WordPressConfig) {
    this.config = config;
    
    // Try alternative REST API route for sites with permalink issues
    const baseURL = `${config.url}/index.php?rest_route=/wp/v2`;
    
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Telegram-MCP-Server/2.2.0'
      }
    });

    // Set up authentication
    if (config.applicationPassword) {
      const credentials = Buffer.from(`${config.username}:${config.applicationPassword}`).toString('base64');
      this.client.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
    } else if (config.password) {
      const credentials = Buffer.from(`${config.username}:${config.password}`).toString('base64');
      this.client.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
    }
  }

  // Posts
  async getPosts(params: {
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    author?: number;
    author_exclude?: number[];
    before_gmt?: string;
    after_gmt?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'id' | 'include' | 'relevance' | 'slug' | 'title';
    slug?: string;
    status?: string;
    categories?: number[];
    categories_exclude?: number[];
    tags?: number[];
    tags_exclude?: number[];
    sticky?: boolean;
  } = {}): Promise<WordPressPost[]> {
    const response = await this.client.get('/posts', { params });
    return response.data;
  }

  async getPost(id: number): Promise<WordPressPost> {
    const response = await this.client.get(`/posts/${id}`);
    return response.data;
  }

  async createPost(post: WordPressPost): Promise<WordPressPost> {
    const response = await this.client.post('/posts', post);
    return response.data;
  }

  async updatePost(id: number, post: Partial<WordPressPost>): Promise<WordPressPost> {
    const response = await this.client.post(`/posts/${id}`, post);
    return response.data;
  }

  async deletePost(id: number, force: boolean = false): Promise<WordPressPost> {
    const response = await this.client.delete(`/posts/${id}`, { 
      params: { force } 
    });
    return response.data;
  }

  // Pages
  async getPages(params: {
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    author?: number;
    author_exclude?: number[];
    before_gmt?: string;
    after_gmt?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'id' | 'include' | 'relevance' | 'slug' | 'title';
    slug?: string;
    status?: string;
    parent?: number;
    parent_exclude?: number[];
    menu_order?: number;
  } = {}): Promise<WordPressPage[]> {
    const response = await this.client.get('/pages', { params });
    return response.data;
  }

  async getPage(id: number): Promise<WordPressPage> {
    const response = await this.client.get(`/pages/${id}`);
    return response.data;
  }

  async createPage(page: WordPressPage): Promise<WordPressPage> {
    const response = await this.client.post('/pages', page);
    return response.data;
  }

  async updatePage(id: number, page: Partial<WordPressPage>): Promise<WordPressPage> {
    const response = await this.client.post(`/pages/${id}`, page);
    return response.data;
  }

  async deletePage(id: number, force: boolean = false): Promise<WordPressPage> {
    const response = await this.client.delete(`/pages/${id}`, { 
      params: { force } 
    });
    return response.data;
  }

  // Media
  async getMedia(params: {
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    author?: number;
    author_exclude?: number[];
    before_gmt?: string;
    after_gmt?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'id' | 'include' | 'relevance' | 'slug' | 'title';
    slug?: string;
    status?: string;
    media_type?: 'image' | 'video' | 'audio' | 'application';
    mime_type?: string;
    parent?: number;
    parent_exclude?: number[];
  } = {}): Promise<WordPressMedia[]> {
    const response = await this.client.get('/media', { params });
    return response.data;
  }

  async getMediaItem(id: number): Promise<WordPressMedia> {
    const response = await this.client.get(`/media/${id}`);
    return response.data;
  }

  async uploadMedia(file: Buffer | string, filename: string, title?: string, alt_text?: string, caption?: string, description?: string): Promise<WordPressMedia> {
    const formData = new FormData();
    
    if (typeof file === 'string') {
      // If file is a URL, download it first
      const fileResponse = await axios.get(file, { responseType: 'arraybuffer' });
      formData.append('file', Buffer.from(fileResponse.data), filename);
    } else {
      formData.append('file', file, filename);
    }
    
    if (title) formData.append('title', title);
    if (alt_text) formData.append('alt_text', alt_text);
    if (caption) formData.append('caption', caption);
    if (description) formData.append('description', description);

    const response = await this.client.post('/media', formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }

  /**
   * Upload media file directly as binary data (more efficient for large files)
   */
  async uploadMediaBinary(fileBuffer: Buffer, filename: string, mimeType: string, title?: string, alt_text?: string, caption?: string, description?: string): Promise<WordPressMedia> {
    const headers: any = {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': mimeType,
      'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.applicationPassword}`).toString('base64')}`
    };

    // Use axios with proper binary data handling
    const response = await axios.post(`${this.config.url}/wp-json/wp/v2/media`, fileBuffer, {
      headers,
      timeout: 60000, // 60 seconds timeout for large files
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      responseType: 'json',
      transformRequest: [(data) => data] // Prevent axios from transforming the data
    });
    
    const media = response.data;
    
    // Update metadata if provided
    if (title || alt_text || caption || description) {
      const updateData: any = {};
      if (title) updateData.title = title;
      if (alt_text) updateData.alt_text = alt_text;
      if (caption) updateData.caption = caption;
      if (description) updateData.description = description;
      
      const updateResponse = await this.client.post(`/media/${media.id}`, updateData);
      return updateResponse.data;
    }
    
    return media;
  }

  /**
   * Update media metadata (alt_text, caption, description)
   */
  async updateMediaMetadata(id: number, metadata: {
    title?: string;
    alt_text?: string;
    caption?: string;
    description?: string;
  }): Promise<WordPressMedia> {
    const response = await this.client.post(`/media/${id}`, metadata);
    return response.data;
  }

  async updateMedia(id: number, media: Partial<WordPressMedia>): Promise<WordPressMedia> {
    const response = await this.client.post(`/media/${id}`, media);
    return response.data;
  }

  async deleteMedia(id: number, force: boolean = false): Promise<WordPressMedia> {
    const response = await this.client.delete(`/media/${id}`, { 
      params: { force } 
    });
    return response.data;
  }

  // Users
  async getUsers(params: {
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'id' | 'include' | 'name' | 'registered_date' | 'slug' | 'email' | 'url';
    slug?: string;
    roles?: string[];
    who?: 'authors';
  } = {}): Promise<WordPressUser[]> {
    const response = await this.client.get('/users', { params });
    return response.data;
  }

  async getUser(id: number): Promise<WordPressUser> {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }

  async createUser(user: WordPressUser): Promise<WordPressUser> {
    const response = await this.client.post('/users', user);
    return response.data;
  }

  async updateUser(id: number, user: Partial<WordPressUser>): Promise<WordPressUser> {
    const response = await this.client.post(`/users/${id}`, user);
    return response.data;
  }

  async deleteUser(id: number, force: boolean = false, reassign?: number): Promise<WordPressUser> {
    const response = await this.client.delete(`/users/${id}`, { 
      params: { force, reassign } 
    });
    return response.data;
  }

  // Categories
  async getCategories(params: {
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
    hide_empty?: boolean;
    parent?: number;
    post?: number;
    slug?: string;
  } = {}): Promise<WordPressCategory[]> {
    const response = await this.client.get('/categories', { params });
    return response.data;
  }

  async getCategory(id: number): Promise<WordPressCategory> {
    const response = await this.client.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(category: WordPressCategory): Promise<WordPressCategory> {
    const response = await this.client.post('/categories', category);
    return response.data;
  }

  async updateCategory(id: number, category: Partial<WordPressCategory>): Promise<WordPressCategory> {
    const response = await this.client.post(`/categories/${id}`, category);
    return response.data;
  }

  async deleteCategory(id: number, force: boolean = false): Promise<WordPressCategory> {
    const response = await this.client.delete(`/categories/${id}`, { 
      params: { force } 
    });
    return response.data;
  }

  // Tags
  async getTags(params: {
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
    hide_empty?: boolean;
    post?: number;
    slug?: string;
  } = {}): Promise<WordPressTag[]> {
    const response = await this.client.get('/tags', { params });
    return response.data;
  }

  async getTag(id: number): Promise<WordPressTag> {
    const response = await this.client.get(`/tags/${id}`);
    return response.data;
  }

  async createTag(tag: WordPressTag): Promise<WordPressTag> {
    const response = await this.client.post('/tags', tag);
    return response.data;
  }

  async updateTag(id: number, tag: Partial<WordPressTag>): Promise<WordPressTag> {
    const response = await this.client.post(`/tags/${id}`, tag);
    return response.data;
  }

  async deleteTag(id: number, force: boolean = false): Promise<WordPressTag> {
    const response = await this.client.delete(`/tags/${id}`, { 
      params: { force } 
    });
    return response.data;
  }

  // Comments
  async getComments(params: {
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'date_gmt' | 'id' | 'include' | 'post' | 'parent' | 'type';
    parent?: number;
    parent_exclude?: number[];
    post?: number;
    status?: 'hold' | 'approve' | 'spam' | 'trash';
    type?: string;
    password?: string;
  } = {}): Promise<any[]> {
    const response = await this.client.get('/comments', { params });
    return response.data;
  }

  async getComment(id: number): Promise<any> {
    const response = await this.client.get(`/comments/${id}`);
    return response.data;
  }

  async createComment(comment: {
    author?: number;
    author_email?: string;
    author_name?: string;
    author_url?: string;
    content: string;
    date?: string;
    date_gmt?: string;
    parent?: number;
    post: number;
    status?: 'hold' | 'approve' | 'spam' | 'trash';
    meta?: Record<string, any>;
  }): Promise<any> {
    const response = await this.client.post('/comments', comment);
    return response.data;
  }

  async updateComment(id: number, comment: any): Promise<any> {
    const response = await this.client.post(`/comments/${id}`, comment);
    return response.data;
  }

  async deleteComment(id: number, force: boolean = false): Promise<any> {
    const response = await this.client.delete(`/comments/${id}`, { 
      params: { force } 
    });
    return response.data;
  }

  // Site info
  async getSiteInfo(): Promise<any> {
    // Use direct API call for site info since it's at root level
    const response = await axios.get(`${this.config.url}/index.php?rest_route=/`);
    return response.data;
  }

  async getSettings(): Promise<any> {
    const response = await this.client.get('/settings');
    return response.data;
  }

  async updateSettings(settings: any): Promise<any> {
    const response = await this.client.post('/settings', settings);
    return response.data;
  }

  // Search
  async search(query: string, type?: 'post' | 'page' | 'attachment' | 'any'): Promise<any[]> {
    const params: any = { search: query };
    if (type) params.type = type;
    
    const response = await this.client.get('/search', { params });
    return response.data;
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/');
      return true;
    } catch (error) {
      return false;
    }
  }
}
