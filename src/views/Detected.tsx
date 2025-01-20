import { useLocation } from 'react-router';

const Detected = () => {
  const { state } = useLocation();
  console.log('state', state);
  // store descriptors to lokijs database

  return <div>Detected</div>;
};

export default Detected;
