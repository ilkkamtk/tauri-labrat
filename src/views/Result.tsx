import { useStore } from '@/stores/DBStore';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const Result = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(2);
  const { state } = useLocation();
  const { addVotes } = useStore();

  useEffect(() => {
    console.log('useEffect in Result');
    try {
      if (state) {
        addVotes(state);
      }
    } catch (error) {
      console.error(error);
    }

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          navigate('/face');
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 text-center text-xl leading-10">
      <h2 className="text-3xl text-center">
        {state?.vote} by {state?.faceName} saved
      </h2>
      <p className="text-sm">Returning to detection in {time}s</p>
    </div>
  );
};

export default Result;
