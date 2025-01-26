import { createContext, useEffect, useState } from 'react';
import { useDB } from '../hooks/DBHooks';
import { DBState, Vote } from '@/types/localTypes';

type DbContextType = {
  dbState: DBState;
  addFaces: (doc: Float32Array) => Float32Array | undefined;
  getAllFaces: () => (Float32Array & LokiObj)[];
  deleteAllFromDB: () => void;
  addVotes: (vote: Vote) => Vote | undefined;
  getAllVotes: () => (Vote & LokiObj)[];
  faces: (Float32Array & LokiObj)[];
};

const DbContext = createContext<DbContextType | null>(null);

const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const [faces, setFaces] = useState<(Float32Array & LokiObj)[]>([]);
  const {
    dbState,
    addFaces: dbAddFaces,
    getAllFaces,
    deleteAllFromDB: dbDeleteAll,
    addVotes,
    getAllVotes,
  } = useDB();

  const updateFaces = () => {
    if (dbState.status === 'ready') {
      const allFaces = getAllFaces();
      console.log('Updating faces:', allFaces);
      setFaces(allFaces);
    }
  };

  useEffect(() => {
    updateFaces();
  }, [dbState.status]);

  const addFaces = (doc: Float32Array) => {
    const result = dbAddFaces(doc);
    updateFaces();
    return result;
  };

  const deleteAllFromDB = () => {
    dbDeleteAll();
    setFaces([]);
  };

  return (
    <DbContext.Provider
      value={{
        dbState,
        addFaces,
        getAllFaces,
        deleteAllFromDB,
        addVotes,
        getAllVotes,
        faces,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export { DbContext, DbProvider };
