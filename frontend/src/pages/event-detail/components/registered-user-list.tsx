import authAxios from "@/services/authAxios";
import { useQuery } from "@tanstack/react-query";

interface Registration {
  _id: string;
  userId?: {
    name: string;
    email: string;
  };
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

function RegisteredUsersList({ eventId }: { eventId: string }) {
  const { data: registrationData, isFetching } = useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: async () => {
      const res = await authAxios.get(`/api/registration/users/${eventId}`);
      return res.data;
    },
  });

  const registrations: Registration[] = registrationData?.registrations;

  if (isFetching) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
        Loading registered users...
      </div>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground bg-secondary/20 rounded-lg border border-dashed border-border">
        No users have registered for this event yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Registered On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!!registrations?.length &&
              registrations.map((reg) => {
                const regDate = new Date(reg.createdAt).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "short", day: "numeric" }
                );
                return (
                  <tr
                    key={reg._id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {reg.userId?.name || "Unknown User"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {reg.userId?.email || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {/* <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                          reg.status === "confirmed"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : reg.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {reg.status}
                      </span> */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400`}
                      >
                        Confirmed
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {regDate}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RegisteredUsersList;
