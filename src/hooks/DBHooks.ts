import { useEffect, useState } from 'react';
import Loki from 'lokijs';
import { DBState, Vote } from '@/types/localTypes';

// Singleton database instance
let dbInstance: Loki | null = null;
let isInitializing = false;

const initDB = (callback: (db: Loki) => void) => {
  if (!dbInstance && !isInitializing) {
    isInitializing = true;
    console.log('Creating new database instance...');
    dbInstance = new Loki('1.json');
    dbInstance.loadDatabase({}, () => {
      isInitializing = false;
      callback(dbInstance!);
    });
  } else if (dbInstance) {
    callback(dbInstance);
  }
};

const useDB = () => {
  const [state, setState] = useState<DBState>({ status: 'initializing' });

  useEffect(() => {
    initDB((db) => {
      const faces =
        db.getCollection<Float32Array>('faces') || db.addCollection('faces');
      const votes =
        db.getCollection<Vote>('votes') || db.addCollection('votes');
      console.log('Collections ready:', {
        facesCount: faces.count(),
        votesCount: votes.count(),
      });
      setState({ status: 'ready', db, faces, votes });
    });
  }, []);

  if (state.status !== 'ready') {
    return {
      state,
      addFaces: () => {
        throw new Error('Database not ready');
      },
      addVotes: () => {
        throw new Error('Database not ready');
      },
      getAllFaces: () => [],
      getAllVotes: () => [],
      deleteAllFromDB: () => {
        throw new Error('Database not ready');
      },
    };
  }

  return {
    state,
    getAllFaces: () => state.faces.find(),
    getAllVotes: () => state.votes.find(),
    addFaces: (face: Float32Array) => {
      const response = state.faces.insert(face);
      state.db.saveDatabase();
      return response;
    },
    addVotes: (vote: Vote) => {
      const response = state.votes.insert(vote);
      state.db.saveDatabase();
      return response;
    },
    deleteAllFromDB: () => {
      state.faces.clear();
      state.votes.clear();
      state.db.saveDatabase();
    },
  };
};
export { useDB };
