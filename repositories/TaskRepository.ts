import db from "~/helpers/databases/db";
import BoardListsRepository from "~/repositories/BoardListsRepository";
import type { BoardList } from "~/types";

export type CreateTaskPayload = {
  listId: string;
  id: string;
  title: string;
  description: string;
};

class TaskRepository {
  static async create({ listId, ...payload }: CreateTaskPayload) {
    const lists = await BoardListsRepository.getAll();
    const updated = lists.map((list: BoardList) => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: [...list.tasks, payload],
        };
      }
      return list;
    });

    await db.setItem("lists", updated);
  }
}

export default TaskRepository;
