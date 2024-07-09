import db from "~/helpers/databases/db";
import type { BoardList } from "~/types";

class BoardListsRepository {
  static async getAll() {
    const data = await db.getItem("lists");
    return (data || []) as BoardList[];
  }

  static async create(payload: { id: string; title: string }) {
    const prevItem = await this.getAll();
    await db.setItem("lists", [
      ...prevItem,
      {
        id: payload.id,
        order: 0,
        title: payload.title,
        tasks: [],
      },
    ]);
  }

  static async update(id: string, payload: { title: string }) {
    const lists = await this.getAll();
    const updated = lists.map((list) => {
      if (list.id === id) {
        return {
          ...list,
          title: payload.title,
        };
      }
      return list;
    });

    await db.setItem("lists", updated);
  }
}

export default BoardListsRepository;
