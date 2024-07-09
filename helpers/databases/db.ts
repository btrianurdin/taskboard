import Dexie, { type EntityTable } from "dexie";
import localforage from "localforage";
import type { BoardList } from "~/types";

// const db = new Dexie("_mytodo_") as Dexie & {
//   lists: EntityTable<BoardList, "id">;
// };

// db.version(1).stores({
//   lists: "++id, title, *tasks",
// });

const db = localforage.createInstance({
  driver: localforage.LOCALSTORAGE,
  name: "_mytodo_",
  version: 1.0,
});

export default db;
