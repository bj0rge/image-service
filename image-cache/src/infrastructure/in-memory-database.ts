export type Database = {
  saveFile: (args: { id: string; name: string }) => void;
  __testOnly__: {
    fileNamesById: Map<string, string>;
  };
};

export const buildDatabase = (): Database => {
  const fileNamesById: Map<string, string> = new Map();

  const saveFile: Database["saveFile"] = ({ id, name }) => {
    fileNamesById.set(id, name);
  };

  return {
    saveFile,
    __testOnly__: {
      fileNamesById,
    },
  };
};
