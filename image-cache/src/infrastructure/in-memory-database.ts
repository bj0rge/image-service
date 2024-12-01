import type { FileInfo, ImageMimetype } from "../domain";

export type Database = {
  saveFile: (args: {
    id: string;
    name: string;
    mimetype: ImageMimetype;
  }) => void;
  getFile: (id: string) => FileInfo | undefined;

  __testOnly__: {
    fileInfoById: Map<string, FileInfo>;
  };
};

export const buildDatabase = (): Database => {
  const fileInfoById: Map<string, FileInfo> = new Map();

  const saveFile: Database["saveFile"] = ({ id, name, mimetype }) => {
    fileInfoById.set(id, { id, name, mimetype });
  };

  const getFile: Database["getFile"] = (id) => fileInfoById.get(id);

  return {
    saveFile,
    getFile,
    __testOnly__: {
      fileInfoById,
    },
  };
};
