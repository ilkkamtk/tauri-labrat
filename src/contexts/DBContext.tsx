import { createContext, useEffect, useState } from 'react';
import { useDB } from '../hooks/DBHooks';
import { DBState, Vote } from '@/types/localTypes';

type DbContextType = {
  state: DBState;
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
    state,
    addFaces: dbAddFaces,
    getAllFaces,
    deleteAllFromDB: dbDeleteAll,
    addVotes,
    getAllVotes,
  } = useDB();

  const updateFaces = () => {
    if (state.status === 'ready') {
      const allFaces = getAllFaces();
      console.log('Updating faces:', allFaces);
      setFaces(allFaces);
    }
  };

  useEffect(() => {
    updateFaces();
  }, [state.status]);

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
        state,
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
