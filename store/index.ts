import { defineStore } from "pinia";
import db from "~/helpers/databases/db";
import type { AddTask, BoardList } from "~/types";

type InitialStatus = "idle" | "loading" | "ready" | "error";

const useTodoStore = () => {
  const _store = defineStore("_todo_store_", {
    state() {
      return {
        status: "idle" as InitialStatus,
        boardLists: [] as BoardList[],
      };
    },
    actions: {
      async initializeBoardLists() {
        try {
          this.status = "loading";
          this.boardLists = await db.lists.toArray();
          this.status = "ready";
        } catch (error) {
          this.status = "error";
        }
      },
      addBordLists(params: { id: string; title: string }) {
        const payload = {
          id: params.id,
          title: params.title,
          tasks: [],
        };
        this.boardLists.push(payload);
        db.lists.add(payload);
      },
      addTask(params: AddTask) {
        const board = this.boardLists.find(
          (board) => board.id === params.listId
        );
        if (board) {
          const payload = {
            id: params.id,
            title: params.title,
            description: "",
          };
          board.tasks.push(payload);
          db.table("lists")
            .where("id")
            .equals(params.listId)
            .modify((list) => {
              list.tasks.push(payload);
            });
        }
      },
    },
  });

  const _todoStore = _store();

  if (_todoStore.status === "idle") {
    console.log("initializeBoardLists");
    _todoStore.initializeBoardLists();
  }

  return _todoStore;
};

export default useTodoStore;
