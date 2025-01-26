import { useEffect, useReducer } from 'react';
import Loki from 'lokijs';
import { DBState, Vote } from '@/types/localTypes';

type DBAction =
  | {
      type: 'DB_READY';
      db: Loki;
      faces: Collection<Float32Array>;
      votes: Collection<Vote>;
    }
  | { type: 'DB_ERROR'; error: string };

function dbReducer(dbState: DBState, action: DBAction): DBState {
  switch (action.type) {
    case 'DB_READY':
      return {
        status: 'ready',
        db: action.db,
        faces: action.faces,
        votes: action.votes,
      };
    case 'DB_ERROR':
      return {
        status: 'error',
        error: new Error(action.error),
      };
    default:
      return dbState;
  }
}

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
  const [dbState, dispatch] = useReducer(dbReducer, { status: 'initializing' });

  useEffect(() => {
    initDB((db) => {
      try {
        const faces =
          db.getCollection<Float32Array>('faces') || db.addCollection('faces');
        const votes =
          db.getCollection<Vote>('votes') || db.addCollection('votes');
        console.log('Collections ready:', {
          facesCount: faces.count(),
          votesCount: votes.count(),
        });
        dispatch({ type: 'DB_READY', db, faces, votes });
      } catch (error) {
        dispatch({ type: 'DB_ERROR', error: (error as Error).message });
      }
    });
  }, []);

  if (dbState.status !== 'ready') {
    return {
      dbState,
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
    dbState,
    getAllFaces: () => dbState.faces.find(),
    getAllVotes: () => dbState.votes.find(),
    addFaces: (face: Float32Array) => {
      const response = dbState.faces.insert(face);
      dbState.db.saveDatabase();
      return response;
    },
    addVotes: (vote: Vote) => {
      const response = dbState.votes.insert(vote);
      dbState.db.saveDatabase();
      return response;
    },
    deleteAllFromDB: () => {
      dbState.faces.clear();
      dbState.votes.clear();
      dbState.db.saveDatabase();
    },
  };
};
export { useDB };
