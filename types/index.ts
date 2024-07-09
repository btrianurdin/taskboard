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
};

export type AddTask = {
  listId: string;
  id: string;
  title: string;
};
