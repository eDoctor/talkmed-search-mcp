// 搜索请求接口
export interface SearchRequest {
  word: string;
  type?: 'all' | 'course' | 'live';
  page?: number;
}

// 搜索响应接口
export interface SearchResponse {
  code: number;
  data: {
    course?: {
      title: string;
      items: CourseItem[];
      has_more: boolean;
    };
    live?: {
      title: string;
      items: LiveItem[];
    };
  };
}

// 课程项目接口
export interface CourseItem {
  id: number;
  title: string;
  cover: string;
  thumb_cover: string;
  course_type: number;
  price_type: number;
  price: number;
  original_price: number;
  learn_count: number;
  buy_count: string;
  learn_count_show: number;
  course_count: number;
  course_updated_count: number;
  tag_bg_color: string;
  tag_name: string;
  action: {
    type: number;
    data: { id: number };
    needLogin: boolean;
    reload: boolean;
  };
}

// 会议项目接口
export interface LiveItem {
  id: number;
  title: string;
  sub_title: string | null;
  des: string;
  banner: string;
  url: string | null;
  status: number;
  preview: string | null;
  type: number;
  tk_room_id: string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sign_type: number;
  share_img: string;
  allow_review: number;
  preview_gif: string;
  is_remind: number;
  show_home_page: number;
  is_preview_gif: number;
  preview_gif_config: string;
  is_show_join_user: number;
  live_status: number;
  live_status_text: string;
  speakers: any[];
  preview_url: string;
  tag: string;
  tag_bg_color: string;
  action: {
    type: number;
    data: { id: number };
    needLogin: boolean;
    reload: boolean;
  };
}

// CLI 选项接口
export interface CLIOptions {
  type?: 'all' | 'course' | 'live';
  page?: number;
  interactive?: boolean;
}

// 格式化显示项目接口
export interface DisplayItem {
  id: number;
  title: string;
  type: 'course' | 'live';
  description: string;
  status?: string;
  url?: string;
}

// 分页信息接口
export interface PaginationInfo {
  currentPage: number;
  hasMore: boolean;
  totalDisplayed: number;
}

// 搜索结果汇总接口
export interface SearchResultSummary {
  courses: CourseItem[];
  lives: LiveItem[];
  pagination: PaginationInfo;
  keyword: string;
  searchType: string;
}