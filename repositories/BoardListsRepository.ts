import db from "~/helpers/databases/db";
import type { BoardList } from "~/types";

class BoardListsRepository {
  static async getAll() {
    const data = await db.getItem("lists");
    return (data || []) as BoardList[];
  }

  static async update(id: string, payload: { title: string }) {
    const lists = await this.getAll();
    const updated = lists.map((list) => {
      if (list.id === id) {
        return {
          ...list,
          title: payload?.title,
        };
      }
      return list;
    });

    await db.setItem("lists", updated);
  }

  static async updateAll(payload: BoardList[]) {
    await db.setItem("lists", payload);
  }
}

export default BoardListsRepository;
