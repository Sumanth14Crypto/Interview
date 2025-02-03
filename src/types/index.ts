export interface Candidate {
  fullName: string;
  collegeName: string;
  dateOfBirth: string;
  department: 'Computer Science' | 'Civil' | 'Mechanical' | 'Electrical';
}

export interface Question {
  id: number;
  text: string;
}

export interface VideoSubmission {
  questionId: number;
  videoBlob: Blob;
}

export interface StoredCandidate {
  id: string;
  full_name: string;
  college_name: string;
  date_of_birth: string;
  department: string;
  created_at: string;
}

export interface StoredVideo {
  id: string;
  candidate_id: string;
  question_id: number;
  video_url: string;
  created_at: string;
}