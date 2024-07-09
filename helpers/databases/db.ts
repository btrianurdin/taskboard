import Dexie, { type EntityTable } from "dexie";
import type { BoardList } from "~/types";

const db = new Dexie("_mytodo_") as Dexie & {
  lists: EntityTable<BoardList, "id">;
};

db.version(1).stores({
  lists: "++id, title, tasks",
});

export default db;
