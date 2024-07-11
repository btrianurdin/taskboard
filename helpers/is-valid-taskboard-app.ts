import { isNonEmptyArray } from "~/helpers/array-fn";

const isValidTaskboardApp = (data: any, validVersion: string) => {
  if (typeof data === "object") {
    const isValidType =
      "type" in data &&
      data.type === "taskboardapp" &&
      "version" in data &&
      data.version === validVersion;
    const isValidData = "data" in data && typeof data.data === "object";
    const isValidDataKeys =
      isNonEmptyArray(data.data) &&
      Object.keys(data.data[0]).every((key) =>
        ["id", "title", "tasks"].includes(key)
      );

    if (!isValidType || !isValidData || !isValidDataKeys) return false;
    return true;
  }
  return false;
};

export default isValidTaskboardApp;
