export class DocumentEntity {
  id: string;
  chunk_num: number;
  create_date: string;
  create_time: number;
  created_by: string;
  kb_id: string;
  location: string;
  meta_fields: object;
  name: string;
  parser_config: {
    auto_keywords: number;
    auto_questions: number;
    chunk_token_num: number;
    delimiter: string;
    graphrag: {
      use_graphrag: boolean;
    };
    html4excel: boolean;
    layout_recognize: string;
    raptor: {
      use_raptor: boolean;
    };
    topn_tags: number;
  };
  parser_id: string;
  process_begin_at: string | null;
  process_duration: number;
  progress: number;
  progress_msg: string;
  run: string;
  size: number;
  source_type: string;
  status: string;
  suffix: string;
  thumbnail: string;
  token_num: number;
  type: string;
  update_date: string;
  update_time: number;
}
