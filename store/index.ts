import { defineStore } from "pinia";
import BoardListsRepository from "~/repositories/BoardListsRepository";
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
        this.boardLists.push({
          id: params.id,
          title: params.title,
          tasks: [],
        });
        BoardListsRepository.updateAll(this.boardLists);
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
          board.tasks.push({
            id: params.id,
            title: params.title,
            description: "",
          });
          BoardListsRepository.updateAll(this.boardLists);
        }
      },
      triggerMove() {
        BoardListsRepository.updateAll(this.boardLists);
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
