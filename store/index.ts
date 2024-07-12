import dayjs from "dayjs";
import { defineStore } from "pinia";
import BoardListsRepository from "~/repositories/BoardListsRepository";
import type {
  AddTask,
  BoardList,
  Checklist,
  CreateBoardList,
  Optional,
  Task,
  UpdateBoardList,
} from "~/types";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type InitialStatus = "idle" | "loading" | "ready" | "error";

const useTodoStore = () => {
  const _store = defineStore("_todo_store_", {
    state() {
      return {
        status: "idle" as InitialStatus,
        boardLists: [] as BoardList[],
      };
    },
    getters: {
      tasks: (state) => {
        return state.boardLists.reduce((acc, board) => {
          return [...acc, ...board.tasks];
        }, [] as Task[]);
      },
      taskHasDueDate: (state) => {
        return state.boardLists.reduce((acc, board) => {
          const _tasks = board.tasks
            .filter((task) => task.dueDate)
            .map((task) => ({
              ...task,
              listId: board.id,
            }));

          return [...acc, ..._tasks];
        }, [] as (Task & { listId: string })[]);
      },
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
        this.storageUpdate();
      },
      updateBoardList(params: UpdateBoardList) {
        const board = this.boardLists.find((board) => board.id === params.id);
        if (board) {
          board.title = params.title;
          BoardListsRepository.update(params.id, { title: params.title });
        }
      },
      deleteBoardList(id: string) {
        this.boardLists = this.boardLists.filter((board) => board.id !== id);
        BoardListsRepository.delete(id);
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
          this.storageUpdate();
        }
      },
      updateTaskTitle(params: {
        listId: string;
        taskId: string;
        title: string;
      }) {
        const board = this.boardLists.find(
          (board) => board.id === params.listId
        );
        if (board) {
          const task = board.tasks.find((task) => task.id === params.taskId);
          if (task) {
            task.title = params.title;
            this.storageUpdate();
          }
        }
      },
      deleteTask(listId: string, taskId: string) {
        const board = this.boardLists.find((board) => board.id === listId);
        if (board) {
          board.tasks = board.tasks.filter((task) => task.id !== taskId);
          this.storageUpdate();
        }
      },
      updateTaskDescription(params: {
        listId: string;
        taskId: string;
        description: string;
      }) {
        const board = this.boardLists.find(
          (board) => board.id === params.listId
        );
        if (board) {
          const task = board.tasks.find((task) => task.id === params.taskId);
          if (task) {
            task.description = params.description;
            this.storageUpdate();
          }
        }
      },
      addTaskChecklist(params: {
        listId: string;
        taskId: string;
        checklistId: string;
        title: string;
      }) {
        const board = this.boardLists.find(
          (board) => board.id === params.listId
        );
        if (board) {
          const task = board.tasks.find((task) => task.id === params.taskId);
          if (task) {
            if (!task.checklists) task.checklists = [];
            task.checklists.push({
              id: params.checklistId,
              title: params.title,
              isChecked: false,
            });
            this.storageUpdate();
          }
        }
      },
      updateTaskChecklist(params: {
        action: "update" | "delete";
        listId: string;
        taskId: string;
        checklistId: string;
        data?: Optional<Omit<Checklist, "id">, "title" | "isChecked">;
      }) {
        const board = this.boardLists.find(
          (board) => board.id === params.listId
        );
        if (board) {
          const task = board.tasks.find((task) => task.id === params.taskId);
          if (task) {
            if (params.action === "update") {
              const checklist = task.checklists?.find(
                (checklist) => checklist.id === params.checklistId
              );
              if (checklist) {
                checklist.title = params?.data?.title ?? checklist.title;
                checklist.isChecked =
                  params?.data?.isChecked ?? checklist.isChecked;
              }
            }
            if (params.action === "delete") {
              task.checklists = task.checklists?.filter(
                (checklist) => checklist.id !== params.checklistId
              );
            }
            this.storageUpdate();
          }
        }
      },
      updateTaskDueDate(params: {
        listId: string;
        taskId: string;
        date: { start: string; end: string };
      }) {
        const board = this.boardLists.find(
          (board) => board.id === params.listId
        );
        if (board) {
          const task = board.tasks.find((task) => task.id === params.taskId);
          if (task) {
            task.dueDate = params.date;
            this.storageUpdate();
          }
        }
      },
      deleteTaskDueDate(listId: string, taskId: string) {
        const board = this.boardLists.find((board) => board.id === listId);
        if (board) {
          const task = board.tasks.find((task) => task.id === taskId);
          if (task) {
            task.dueDate = undefined;
            this.storageUpdate();
          }
        }
      },

      getTaskById(listId: string, taskId: string) {
        const board = this.boardLists.find((board) => board.id === listId);
        if (board) {
          return board.tasks.find((task) => task.id === taskId);
        }
        return null;
      },

      getTaskByDate(date: Date) {
        const _date = dayjs(date).add(1, "minute").toISOString();
        return this.taskHasDueDate.filter(
          (task) =>
            task.dueDate &&
            dayjs(task.dueDate.start).isSameOrBefore(_date, "day") &&
            dayjs(task.dueDate.end).isSameOrAfter(_date, "day")
        );
      },

      // save changes state to local storage
      storageUpdate() {
        BoardListsRepository.updateAll(this.boardLists);
      },

      // export data
      async exportData() {
        const data = await BoardListsRepository.getAll();
        const metadata = {
          type: "taskboardapp",
          version: "1.0",
          data,
        };
        return JSON.stringify(metadata);
      },
      // import data
      async importData(metadata: { type: string; version: string; data: any }) {
        await BoardListsRepository.updateAll(metadata.data);
        this.initializeBoardLists();
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
