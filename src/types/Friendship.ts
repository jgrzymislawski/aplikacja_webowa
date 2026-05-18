export type Friendship = {
  id: string;
  requester: {
    id: string;
    email: string;
  };
  recipient: {
    id: string;
    email: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED";
};
