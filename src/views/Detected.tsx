import { useDB } from '@/hooks/DBHooks';
import { useLocation } from 'react-router';

const Detected = () => {
  const { state: locationState } = useLocation();
  const { state, addFaces } = useDB();
  // store descriptors to lokijs database
  try {
    if (state.status === 'ready') addFaces(locationState);
  } catch (error) {
    console.error(error);
  }
  return <div>Detected</div>;
};

export default Detected;
