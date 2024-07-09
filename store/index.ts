import { defineStore } from "pinia";
import BoardListsRepository from "~/repositories/BoardListsRepository";
import TaskRepository from "~/repositories/TaskRepository";
import type {
  AddTask,
  BoardList,
  CreateBoardList,
  UpdateBoardList,
} from "~/types";

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
          this.boardLists = await BoardListsRepository.getAll();
          this.status = "ready";
        } catch (error) {
          this.status = "error";
        }
      },
      addBordLists(params: CreateBoardList) {
        const payload = {
          id: params.id,
          title: params.title,
          tasks: [],
        };
        this.boardLists.push(payload);
        BoardListsRepository.create(payload);
      },
      updateBoardList(params: UpdateBoardList) {
        const board = this.boardLists.find((board) => board.id === params.id);
        if (board) {
          board.title = params.title;
          BoardListsRepository.update(params.id, { title: params.title });
        }
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
          TaskRepository.create({ listId: board.id, ...payload });
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
