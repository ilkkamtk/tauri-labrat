import { useEffect, useState } from 'react';
import Loki from 'lokijs';
import { DBState, Vote } from '@/types/localTypes';

const useDB = () => {
  const [state, setState] = useState<DBState>({ status: 'initializing' });
  useEffect(() => {
    try {
      const db = new Loki('1.json');
      db.loadDatabase({}, () => {
        const faces =
          db.getCollection<Float32Array>('faces') || db.addCollection('faces');
        const votes =
          db.getCollection<Vote>('votes') || db.addCollection('votes');
        setState({ status: 'ready', db, faces, votes });
      });
    } catch (error) {
      setState({ status: 'error', error: error as Error });
    }
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
