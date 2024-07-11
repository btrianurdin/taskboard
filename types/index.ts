export type BoardList = {
  id: string;
  title: string;
  tasks: Task[];
};

export type CreateBoardList = {
  id: string;
  title: string;
};

export type UpdateBoardList = {
  id: string;
  title: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  checklists?: Checklist[];
  dueDate?: {
    start: string;
    end: string;
  };
};

export type Checklist = {
  id: string;
  title: string;
  isChecked: boolean;
};

export type AddTask = {
  listId: string;
  id: string;
  title: string;
};

// type utility
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
