import AccountList from '../../../src/components/AccountList';
import TransferForm from '../../../src/components/TransferForm';

const getAccount = async (id: string) => {
  try {
    const response = await fetch(
      new URL(`http://localhost:3000/api/user/${id}`),
      { cache: 'no-cache' },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user account data: ');
    }
    const accountsData = await response.json();

    return accountsData;
  } catch (error) {
    console.error('Error fetching user account data:', error);
  }
};

const HomePage: React.FC<{ params: { id: string } }> = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  const { user } = await getAccount(id);
  return (
    <div>
      {!user.name ? <h1>{}</h1> : <h1>{user.name}</h1>}
      {!user.accounts ? (
        <div>{}</div>
      ) : (
        <>
          <AccountList accounts={user.accounts} />
          <TransferForm accounts={user.accounts} />
        </>
      )}
    </div>
  );
};

export default HomePage;
