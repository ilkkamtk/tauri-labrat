import { Button } from '@/components/ui/button';
import { useStore } from '@/stores/DBStore';
import { NavLink } from 'react-router';

const Home = () => {
  const { faces, votes, deleteAllFromDB } = useStore();

  const handleClearDatabase = () => {
    try {
      deleteAllFromDB();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="text-center p-4 text-lg">Home</h1>
      <section className="text-center">
        <p>Number of faces in database: {faces.length}</p>
        <p>Number of votes in database: {votes.length}</p>
      </section>
      <section className="p-4">
        <p>Results:</p>

        <div>
          <p>Positives: Z</p>
          <p>Negatives: Å</p>
        </div>
      </section>
      <section className="p-8 flex justify-around">
        <NavLink to={'/face'}>
          <Button>Start Voting</Button>
        </NavLink>
        <Button onClick={handleClearDatabase}>Clear Database</Button>
      </section>
    </>
  );
};

export default Home;
