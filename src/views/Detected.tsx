import { useStore } from '@/stores/DBStore';
import { useLocation } from 'react-router';

const Detected = () => {
  const { state } = useLocation();
  const { addFaces } = useStore();
  console.log('state', state);
  // store descriptors to lokijs database
  try {
    addFaces(state);
  } catch (error) {
    console.error(error);
  }
  return <div>Detected</div>;
};

export default Detected;
