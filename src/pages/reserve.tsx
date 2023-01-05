import { type NextPage } from "next";

import { trpc } from "../utils/trpc";

const ReservePage: NextPage = () => {
  const mutation = trpc["book"].ticket.useMutation();
  console.log(mutation.data);

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate();
        }}
      >
        Click to book
      </button>
    </div>
  );
};

export default ReservePage;
