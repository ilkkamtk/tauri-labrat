import { useDbContext } from '@/hooks/ContextHooks';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const Detected = () => {
  const { state } = useLocation();
  const { addFaces } = useDbContext();
  useEffect(() => {
    // store descriptors to lokijs database
    try {
      addFaces(state);
    } catch (error) {
      console.error(error);
    }
  }, []);
  return <div>Detected</div>;
};

export default Detected;
